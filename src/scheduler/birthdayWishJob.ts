import cron from 'node-cron';
import { sendBirthdayWishesCron } from './birthdayWishCron.js';

export function startBirthdayWishScheduler() {
  // Run the cronjob every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('Running birthday wish cronjob...');
    await sendBirthdayWishesCron();
  });
  console.log('Birthday wish cron scheduler started.');
}
