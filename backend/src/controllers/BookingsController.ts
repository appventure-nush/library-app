import { Request, Response } from 'express';
import Booking from 'models/Booking';
import { BookingCreateData, BookingListViewData, BookingViewData } from 'types/Booking';
import { DestroyOptions, Op } from 'sequelize';
import { AccessTokenSignedPayload } from 'types/tokens';
import User from 'models/User';
import Room from 'models/Room';
import { Role } from 'types/User';

export default class BookingsController {
  public async index(req: Request, res: Response) {
    const bookings = await Booking.findAll<Booking>({ order: [['startTime', 'DESC']] }).then(
      (bookings: Array<Booking>) =>
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
  }

  public async create(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const params: BookingCreateData = req.body;

    const user = await User.findByPk<User>(userId);
    user
      .createBooking({
        userId: userId,
        purpose: params.purpose,
        details: params.details,
        startTime: params.startTime,
        endTime: params.endTime,
      })
      .then((booking: Booking) => res.status(201).json(booking))
      .catch((err: Error) => res.status(500).json(err));
  }

  public async show(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    const currentUser = await User.findByPk<User>(userId);
    const bookingId: number = Number(req.params.id);

    Booking.findByPk<Booking>(bookingId)
      .then(async (booking: Booking | null) => {
        if (booking) {
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
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public async indexSelf(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    const bookings = await Booking.findAll<Booking>({
      where: { userId: userId },
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
  }

  public indexUpcoming(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    Booking.findAll<Booking>({
      where: { userId: userId, startTime: { [Op.gte]: new Date() } },
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
