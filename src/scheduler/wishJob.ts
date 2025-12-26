import cron from 'node-cron';
import { sendWishesCron } from './wishCron.js';

export function startWishScheduler() {
  // Run the cronjob every hour at minute 0
  cron.schedule('* * * * *', async () => {
    console.log('Running wish cronjob...');
    await sendWishesCron();
  });
  console.log('Wish cron scheduler started.');
}
