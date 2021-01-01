import { Request, Response } from 'express';
import Booking from 'models/Booking';
import {
  BookingCreateData,
  BookingListViewData,
  BookingType,
  BookingViewData,
} from 'types/Booking';
import { DestroyOptions, Op } from 'sequelize';
import { AccessTokenSignedPayload } from 'types/tokens';
import User from 'models/User';
import Room from 'models/Room';
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
        .catch((err: Error) => res.status(500).json(err));
    } catch (err) {
      res.sendStatus(500);
    }
  }

  public async create(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const params: BookingCreateData = req.body;
    try {
      const user = await User.findByPk<User>(userId);
      user
        .createBooking({
          type: BookingType.BOOKING,
          userId: userId,
          roomId: params.roomId,
          purpose: params.purpose,
          details: params.details,
          startTime: params.startTime,
          endTime: params.endTime,
        })
        .then((booking: Booking) => res.status(201).json(booking))
        .catch((err: Error) => {
          res.status(500).json(err);
        });
    } catch (err) {
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
        console.log(err);
      });
  }

  public indexUpcoming(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    Booking.findAll<Booking>({
      where: { userId: userId, type: BookingType.BOOKING, startTime: { [Op.gte]: new Date() } },
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
