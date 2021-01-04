import { Request, Response } from 'express';
import Booking from 'models/Booking';
import { BookingType } from 'types/Booking';
import { Op } from 'sequelize';
import { DateTime } from 'luxon';
import { Slot, WeekViewData } from 'types/Week';

export default class WeeksController {
  public async showCurrent(req: Request, res: Response) {
    const now = DateTime.local();
    const startDate = now.startOf('weeks').startOf('day');
    const endDate = startDate.endOf('weeks').minus({ days: 2 });

    try {
      const roomId = Number(req.query.roomId);
      const bookedSlotPromises = await WeeksController.getBookingSlots(
        roomId,
        BookingType.BOOKING,
        startDate.toJSDate(),
        endDate.toJSDate(),
      );

      const disabledSlotPromises = await WeeksController.getBookingSlots(
        roomId,
        BookingType.DISABLED,
        startDate.toJSDate(),
        endDate.toJSDate(),
      );

      Promise.all([bookedSlotPromises, disabledSlotPromises])
        .then(resultArray => {
          const weekViewData: WeekViewData = {
            bookedSlots: resultArray[0],
            disabledSlots: resultArray[1],
          };
          res.status(201).json(weekViewData);
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err) {
      res.sendStatus(500);
    }
  }

  private static async getBookingSlots(
    roomId: number,
    type: BookingType,
    startDate: Date,
    endDate: Date,
  ): Promise<Slot[]> {
    return Booking.findAll<Booking>({
      where: {
        roomId: roomId,
        type: type,
        startTime: { [Op.between]: [startDate, endDate] },
      },
      order: [['startTime', 'ASC']],
    }).then((bookings: Array<Booking>) =>
      bookings.map(booking => {
        return {
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
      }),
    );
  }
}
