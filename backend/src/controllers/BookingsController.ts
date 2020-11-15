import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { BookingCreationAttributes } from '../types/Booking';
import { DestroyOptions } from 'sequelize';

export default class BookingsController {
  public index(req: Request, res: Response) {
    Booking.findAll<Booking>({})
      .then((bookings: Array<Booking>) => res.json(bookings))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: BookingCreationAttributes = req.body;

    Booking.create<Booking>(params)
      .then((booking: Booking) => res.status(201).json(booking))
      .catch((err: Error) => res.status(500).json(err));
  }

  public show(req: Request, res: Response) {
    const bookingId: number = Number(req.params.id);

    Booking.findByPk<Booking>(bookingId).then((booking: Booking | null) =>
      booking ? res.json(booking) : res.status(404).json({ errors: ['Booking not found'] }),
    );
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
