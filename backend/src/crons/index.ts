import { CronJob } from 'cron';
import Booking from 'models/Booking';
import Room from 'models/Room';
import User from 'models/User';
import UserStats from 'models/UserStats';
import { generatePinSync } from 'secure-pin';
import { Op } from 'sequelize';
import { BookingStatus } from 'types/Booking';
import { Role } from 'types/User';
import { DateTime } from 'luxon';
import Infringement from 'models/Infringement';

export const startCronJobs = () => {
  resetBookedPerWeek.start();
  resetInfringement.start();
  refreshCheckInPin.start();
  autoReleaseRoom15.start();
  autoReleaseRoom45.start();
  autoCheckoutBookings.start();
  autoUnbanUsers.start();
};

const resetBookedPerWeek = new CronJob(
  '59 23 * * 0',
  () => {
    UserStats.update<UserStats>({ bookedPerWeek: 0 }, { where: {} })
      .then(() => console.log('[Crons] BookedPerWeek updated'))
      .catch(err =>
        console.log(`[Crons] Error encountered when reseting BookedPerWeek : ${err.message}`),
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
        console.log(`[Crons] Error encountered when refreshing check-in PIN : ${err.message}`),
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
        await Infringement.create({
          userId: user.id,
          details: 'Failed to attend booked session',
        });

        if (user.role === Role.STUDENT) {
          const infringements = await Infringement.findAll({ where: { userId: user.id } });
          const oneMonthLater = DateTime.local().endOf('days').plus({ months: 1 });
          if (infringements.length >= 2) {
            await user.update('bannedEndTime', oneMonthLater.toJSDate(), {
              where: { id: user.id },
            });
            await user.update('bannedReason', 'Infringed library rules twice in this term', {
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
        console.log(`[Crons] Error encountered when auto-checking out bookings: ${err.message}`),
      );
  },
  null,
  false,
  'Asia/Singapore',
);

const autoUnbanUsers = new CronJob(
  '1 0 * * *',
  () => {
    User.update<User>(
      { bannedEndTime: null, bannedReason: null },
      { where: { bannedEndTime: { [Op.lte]: DateTime.local().toJSDate() } }, returning: true },
    )
      .then(([count, users]) =>
        users.forEach(user => console.log(`[Crons] User unbanned: ${user.name}`)),
      )
      .catch(err => console.log(`[Crons] Error encountered when unbanning users: ${err.message}`));
  },
  null,
  false,
  'Asia/Singapore',
);

const resetInfringement = new CronJob(
  '0 0 1 */4 *',
  () => {
    Infringement.destroy({ where: {}, truncate: true })
      .then(count => console.log(`[Crons] Clear infringements for all users`))
      .catch(err =>
        console.log(`[Crons] Error encountered when clearing infringements: ${err.message}`),
      );
  },
  null,
  false,
  'Asia/Singapore',
);
