import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import Booking from 'models/Booking';
import User from 'models/User';
import { Op } from 'sequelize';
import { BookingStatus, BookingType } from 'types/Booking';
import { AccessTokenSignedPayload } from 'types/tokens';
import { Role } from 'types/User';
import { Slot, WeekViewData } from 'types/Week';
import BookingsController from './BookingsController';

export default class WeeksController {
  public async showCurrent(req: Request, res: Response) {
    try {
      const payload = res.locals.payload as AccessTokenSignedPayload;
      const { userId } = payload;
      const user = await User.findByPk<User>(userId);

      const roomId = Number(req.query.roomId);
      const deltaWeek = Number(req.query.delta);

      if (user.role === Role.STUDENT && deltaWeek > 2) {
        res.sendStatus(401);
        return;
      }

      const now = DateTime.local();
      var startDate = now.startOf('day').plus({ weeks: deltaWeek });
      if (deltaWeek !== 0) {
        startDate = startDate.startOf('weeks');
      }
      const endDate = startDate.endOf('weeks').minus({ days: 2 });
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
          var moreDisabledSlots: Slot[] = [];
          if (deltaWeek === 0) {
            for (let weekDay = 1; weekDay < Math.min(now.weekday, 6); weekDay++) {
              const morning8 = now
                .startOf('weeks')
                .startOf('days')
                .plus({ days: weekDay - 1, hours: 8 });
              const evening430 = now
                .startOf('weeks')
                .startOf('days')
                .plus({ days: weekDay - 1, hours: 16, minutes: 30 });
              moreDisabledSlots.push({
                startTime: morning8.toJSDate(),
                endTime: evening430.toJSDate(),
              });
            }
          }
          const weekViewData: WeekViewData = {
            bookedSlots: resultArray[0],
            disabledSlots: [...resultArray[1], ...moreDisabledSlots],
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
        status: { [Op.in]: [BookingStatus.CONFIRMED, BookingStatus.CHECKEDIN] },
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
