import { CronJob } from 'cron';
import Room from 'models/Room';
import { generatePinSync } from 'secure-pin';

export const refreshCheckInPin = new CronJob(
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
