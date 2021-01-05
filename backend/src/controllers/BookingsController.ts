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
      if (user.role === Role.STUDENT) {
        // Check if student has exceeded number of bookings per week
        if (userStats.bookedPerWeek >= 2) throw Error('Number of bookings per week exceeded');
        // Check if booking duration is less than 2hrs for Students
        if (
          DateTime.fromISO(params.endTime)
            .diff(DateTime.fromISO(params.startTime), 'hours')
            .toObject().hours > 2
        )
          throw Error('Booking duration exceeded');
      }

      // Check if this booking overlaps with another booking
      const hasOverlappingBooking = await database.query(
        `SELECT * FROM bookings WHERE "roomId"=? AND tstzrange("startTime", "endTime", '()') && tstzrange(?, ?, '()')`,
        {
          type: QueryTypes.SELECT,
          replacements: [params.roomId, params.startTime, params.endTime],
          transaction: t,
        },
      );
      if (hasOverlappingBooking.length !== 0) {
        throw Error('Slot already booked');
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
    try {
      const currentUser = await User.findByPk<User>(userId);
      const bookingId: number = Number(req.params.id);
      const booking = await Booking.findByPk<Booking>(bookingId);
      if (currentUser.role <= Role.LIBRARIAN && currentUser.id !== booking.userId) {
        res.sendStatus(401);
        return;
      }
      booking.status = BookingStatus.CANCELLED;
      booking
        .save()
        .then(() => res.sendStatus(201))
        .catch(err => {
          throw err;
        });
    } catch (err) {
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

  public indexUpcoming(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    Booking.findAll<Booking>({
      where: {
        userId: userId,
        type: BookingType.BOOKING,
        status: BookingStatus.CONFIRMED,
        startTime: { [Op.gte]: new Date() },
      },
      order: [['startTime', 'ASC']],
    })
      .then((bookings: Array<Booking>) => res.json(bookings))
      .catch((err: Error) => res.status(500).json(err));
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
}
