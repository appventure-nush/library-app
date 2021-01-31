import database from 'config/database';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import Booking from 'models/Booking';
import Room from 'models/Room';
import User from 'models/User';
import UserStats from 'models/UserStats';
import { DestroyOptions, Op, QueryTypes } from 'sequelize';
import {
  BookingCreateData,
  BookingListViewData,
  BookingStatus,
  BookingType,
  BookingViewData,
} from 'types/Booking';
import { AccessTokenSignedPayload } from 'types/tokens';
import { Role } from 'types/User';

export default class BookingsController {
  public async index(req: Request, res: Response) {
    try {
      const bookings = await Booking.findAll<Booking>({
        where: { type: BookingType.BOOKING },
        order: [['startTime', 'DESC']],
      }).then((bookings: Array<Booking>) =>
        bookings.map(async booking => {
          const user = await User.findByPk<User>(booking.userId);
          const room = await Room.findByPk<Room>(booking.roomId);
          const bookingListViewData: BookingListViewData = {
            id: booking.id,
            status: booking.status,
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
            },
            room: {
              id: room.id,
              name: room.name,
            },
            purpose: booking.purpose,
            startTime: booking.startTime,
            endTime: booking.endTime,
          };
          return bookingListViewData;
        }),
      );
      Promise.all(bookings)
        .then(bookings => res.status(201).json(bookings))
        .catch((err: Error) => {
          throw err;
        });
    } catch (err) {
      res.sendStatus(500);
    }
  }

  public async create(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const params: BookingCreateData = req.body;
    const t = await database.transaction();
    try {
      const user = await User.findByPk<User>(userId, { transaction: t });
      const userStats = await UserStats.findOne<UserStats>({
        where: { userId: userId },
      });
      switch (user.role) {
        case Role.STUDENT:
          // Check if user has exceeded number of bookings per week
          if (userStats.bookedPerWeek >= 2) throw Error('Number of bookings per week exceeded');
          // Check if booking duration is less than 2hrs for Students
          if (
            DateTime.fromISO(params.endTime)
              .diff(DateTime.fromISO(params.startTime), 'hours')
              .toObject().hours > 2
          )
            throw Error('Booking duration exceeded');
          if (DateTime.fromISO(params.startTime).diffNow('weeks').toObject().weeks > 1)
            throw Error('Impossible Starting Time');
          break;
        case Role.STAFF:
          if (DateTime.fromISO(params.startTime).diffNow('weeks').toObject().weeks > 4)
            throw Error('Impossible Starting Time');
          break;
        default:
          break;
      }

      // Check if this booking overlaps with another booking
      const hasOverlappingBooking = await database.query(
        `
        SELECT * FROM bookings
        WHERE "status" IN (?, ?)
        AND ("roomId"=? OR ("roomId"!=? AND "userId"=?))
        AND tstzrange("startTime", "endTime", '()') && tstzrange(?, ?, '()')
        `,
        {
          type: QueryTypes.SELECT,
          replacements: [
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKEDIN,
            params.roomId,
            params.roomId,
            userId,
            params.startTime,
            params.endTime,
          ],
          transaction: t,
        },
      );
      if (hasOverlappingBooking.length !== 0) {
        throw Error('Slot already booked');
      }
      if (DateTime.fromISO(params.endTime).diffNow('minutes').minutes < 0) {
        throw Error('EndTime has passed');
      }
      const newBooking = await user.createBooking(
        {
          type: BookingType.BOOKING,
          status: BookingStatus.CONFIRMED,
          userId: userId,
          roomId: params.roomId,
          purpose: params.purpose,
          details: params.details,
          startTime: params.startTime,
          endTime: params.endTime,
        },
        { transaction: t },
      );
      await t.commit();
      res.status(201).json(newBooking);
    } catch (err) {
      await t.rollback();
      res.status(500).json(err);
    }
  }

  public async show(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const bookingId: number = Number(req.params.id);
      const booking = await Booking.findByPk<Booking>(bookingId);
      if (currentUser.role <= Role.LIBRARIAN && currentUser.id !== booking.userId) {
        res.sendStatus(401);
        return;
      }
      const user = await User.findByPk<User>(booking.userId);
      const room = await Room.findByPk<Room>(booking.roomId);
      const bookingViewData: BookingViewData = {
        id: booking.id,
        status: booking.status,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        room: {
          id: room.id,
          name: room.name,
        },
        purpose: booking.purpose,
        startTime: booking.startTime,
        endTime: booking.endTime,
        details: booking.details,
      };
      res.status(201).json(bookingViewData);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  public async cancel(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const t = await database.transaction();
    try {
      const currentUser = await User.findByPk<User>(userId, { transaction: t });
      const bookingId: number = Number(req.params.id);
      const booking = await Booking.findByPk<Booking>(bookingId, { transaction: t });
      if (currentUser.role <= Role.LIBRARIAN && currentUser.id !== booking.userId) {
        res.sendStatus(401);
        return;
      }
      booking.status = BookingStatus.CANCELLED;
      await booking.save({ transaction: t });
      await UserStats.increment<UserStats>('bookedPerWeek', {
        by: -1,
        where: { userId: userId },
        transaction: t,
      });
      await t.commit();
      res.sendStatus(201);
    } catch (err) {
      await t.rollback();
      res.sendStatus(500);
    }
  }

  public async indexSelf(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    const bookings = await Booking.findAll<Booking>({
      where: { userId: userId, type: BookingType.BOOKING },
      order: [['startTime', 'DESC']],
    }).then((bookings: Array<Booking>) => {
      return bookings.map(async booking => {
        const user = await User.findByPk<User>(booking.userId);
        const room = await Room.findByPk<Room>(booking.roomId);
        const bookingListViewData: BookingListViewData = {
          id: booking.id,
          status: booking.status,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
          },
          room: {
            id: room.id,
            name: room.name,
          },
          purpose: booking.purpose,
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
        return bookingListViewData;
      });
    });

    Promise.all(bookings)
      .then(bookings => res.status(201).json(bookings))
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async indexUpcoming(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    const bookings = await Booking.findAll<Booking>({
      where: {
        [Op.or]: [
          {
            userId: userId,
            type: BookingType.BOOKING,
            status: BookingStatus.CONFIRMED,
            endTime: { [Op.gte]: new Date() },
          },
          {
            userId: userId,
            type: BookingType.BOOKING,
            status: BookingStatus.CHECKEDIN,
          },
        ],
      },
      order: [['startTime', 'ASC']],
    }).then((bookings: Array<Booking>) => {
      return bookings.map(async booking => {
        const user = await User.findByPk<User>(booking.userId);
        const room = await Room.findByPk<Room>(booking.roomId);
        const bookingListViewData: BookingListViewData = {
          id: booking.id,
          status: booking.status,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
          },
          room: {
            id: room.id,
            name: room.name,
          },
          purpose: booking.purpose,
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
        return bookingListViewData;
      });
    });

    Promise.all(bookings)
      .then(bookings => res.status(201).json(bookings))
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public delete(req: Request, res: Response) {
    const bookingId: number = Number(req.params.id);
    const deleteOptions: DestroyOptions = {
      where: { id: bookingId },
      limit: 1,
    };

    Booking.destroy(deleteOptions)
      .then(() => res.status(202).json({ data: 'success' }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public async checkIn(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const { checkInPin } = req.body;
    const t = await database.transaction();

    try {
      const bookingId: number = Number(req.params.id);
      var booking = await Booking.findByPk<Booking>(bookingId, { transaction: t });
      if (booking == null || booking.userId !== userId) {
        throw new Error('Booking not found');
      }
      if (booking.status === BookingStatus.CANCELLED) {
        throw new Error('Booking cancelled');
      }
      if (booking.status !== BookingStatus.CONFIRMED) {
        throw new Error('Booking status error');
      }
      const room = await Room.findByPk<Room>(booking.roomId, { transaction: t });
      if (room == null || room.checkInPin !== checkInPin) {
        throw new Error('Incorrect check-in PIN');
      }
      booking.status = BookingStatus.CHECKEDIN;
      await booking.save({ transaction: t });
      await t.commit();
      res.sendStatus(201);
    } catch (err) {
      await t.rollback();
      res.sendStatus(500);
    }
  }

  public async checkOut(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const t = await database.transaction();

    try {
      const bookingId: number = Number(req.params.id);
      var booking = await Booking.findByPk<Booking>(bookingId, { transaction: t });
      if (booking == null || booking.userId !== userId) {
        throw new Error('Booking not found');
      }
      if (booking.status !== BookingStatus.CHECKEDIN) {
        throw new Error('Booking status error');
      }
      booking.status = BookingStatus.CHECKEDOUT;
      await booking.save({ transaction: t });
      await t.commit();
      res.sendStatus(201);
    } catch (err) {
      await t.rollback();
      res.sendStatus(500);
    }
  }

  public async updateStatus(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetBookingId = req.params.id;
      const status: BookingStatus = req.body.status;
      if (currentUser.role < Role.LIBRARIAN) {
        res.sendStatus(401);
        return;
      }
      await Booking.update(
        {
          status: status,
        },
        {
          where: { id: targetBookingId },
          limit: 1,
        },
      );
      res.sendStatus(202);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }
}
