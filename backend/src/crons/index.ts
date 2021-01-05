import { CronJob } from 'cron';
import UserStats from 'models/UserStats';

export const startCronJobs = () => {
  resetBookedPerWeek.start();
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
