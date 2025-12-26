import cron from 'node-cron';
import { sendWishesCron } from './wishCron.js';
import { createMissingBirthdayWishes } from './missingWishJob.js';

export function startWishScheduler() {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running wish cronjob...');
    await sendWishesCron();
  });
  console.log('Wish cron scheduler started.');
}

export function startMissingWishScheduler() {
  cron.schedule('45 * * * *', async () => {
    console.log('Running missing birthday wish scheduler...');
    await createMissingBirthdayWishes();
  });
  console.log('Missing birthday wish scheduler started.');
}
