import { CronJob } from 'cron';
import Booking from 'models/Booking';
import Room from 'models/Room';
import User from 'models/User';
import UserStats from 'models/UserStats';
import { generatePinSync } from 'secure-pin';
import { Op } from 'sequelize';
import { BookingStatus } from 'types/Booking';
import { Role } from 'types/User';

export const startCronJobs = () => {
  resetBookedPerWeek.start();
  refreshCheckInPin.start();
  autoReleaseRoom15.start();
  autoReleaseRoom45.start();
  autoCheckoutBookings.start();
};

const resetBookedPerWeek = new CronJob(
  '59 23 * * 0',
  () => {
    UserStats.update<UserStats>({ bookedPerWeek: 0 }, { where: {} })
      .then(() => console.log('[Crons] BookedPerWeek updated'))
      .catch(err =>
        console.log(`[Conrs] Error encountered when reseting BookedPerWeek : ${err.message}`),
      );
  },
  null,
  false,
  'Asia/Singapore',
);

const refreshCheckInPin = new CronJob(
  '*/15 8-18 * * *',
  () => {
    Room.findAll<Room>()
      .then(rooms => {
        rooms.forEach(room => {
          var roomVar = room;
          roomVar.checkInPin = generatePinSync(6);
          roomVar.save();
        });
      })
      .then(() => console.log('[Crons] Pin refreshed'))
      .catch(err =>
        console.log(`[Conrs] Error encountered when refreshing check-in PIN : ${err.message}`),
      );
  },
  null,
  false,
  'Asia/Singapore',
);

const autoReleaseRoom = () => {
  const now = new Date();
  Booking.update<Booking>(
    { status: BookingStatus.AUTOCANCELLED },
    { where: { startTime: { [Op.lt]: now }, status: BookingStatus.CONFIRMED }, returning: true },
  )
    .then(([count, bookings]) => {
      console.log(`[Crons] Bookings auto-cancelled: ${count}`);
      bookings.forEach(async booking => {
        const user = await User.findByPk(booking.userId);
        await UserStats.increment('bookingMissed', { where: { userId: user.id } });

        if (user.role === Role.STUDENT) {
          const userStats = await UserStats.findOne({ where: { userId: user.id } });
          var oneMonthLater = now;
          oneMonthLater.setMonth(now.getMonth() + 1);
          if (userStats.bookingMissed >= 2) {
            await user.update('bannedEndTime', oneMonthLater, { where: { id: user.id } });
            await user.update('bannedReason', 'Failing to attend booked session twice', {
              where: { id: user.id },
            });
          }
        }
      });
    })
    .catch(err =>
      console.log(`[Crons] Error encountered when auto-cancelling bookings: ${err.message}`),
    );
};

const autoReleaseRoom15 = new CronJob(
  '15 8-18 * * *',
  autoReleaseRoom,
  null,
  false,
  'Asia/Singapore',
);

const autoReleaseRoom45 = new CronJob(
  '45 8-18 * * *',
  autoReleaseRoom,
  null,
  false,
  'Asia/Singapore',
);

const autoCheckoutBookings = new CronJob(
  '*/30 8-19 * * *',
  () => {
    Booking.update<Booking>(
      { status: BookingStatus.CHECKEDOUT },
      { where: { endTime: { [Op.lt]: new Date() }, status: BookingStatus.CHECKEDIN } },
    )
      .then(([count, bookings]) => console.log(`[Crons] Bookings auto-checked-out: ${count}`))
      .catch(err =>
        console.log(`[Conrs] Error encountered when auto-checking out bookings: ${err.message}`),
      );
  },
  null,
  false,
  'Asia/Singapore',
);
