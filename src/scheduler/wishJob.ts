import cron from 'node-cron';
import { sendWIshesCron } from './wishCron.js';

export function startWishScheduler() {
  // Run the cronjob every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('Running wish cronjob...');
    await sendWIshesCron();
  });
  console.log('Birthday wish cron scheduler started.');
}
