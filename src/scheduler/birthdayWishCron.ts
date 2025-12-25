import { AppDataSource } from '../config/typeorm-data-source.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import axios from 'axios';
import pLimit from 'p-limit';

export function shouldSendWish({ sendDate, user }: { sendDate: Date, user: { timezone: string } }, testTimeUtc?: DateTime): { canSend: boolean, now: DateTime, wishDate: DateTime } {
  // testTimeUtc: if provided, use this as the current time in UTC, otherwise use DateTime.now()
  const nowUtc = testTimeUtc || DateTime.now().toUTC();
  const nowInUserTz = nowUtc.setZone(user.timezone);
  const wishDate = DateTime.fromJSDate(sendDate).setZone(user.timezone);
  const canSend = nowInUserTz >= wishDate && nowInUserTz.hour >= 9 && nowInUserTz.hour <= 17;
  return { canSend, now: nowInUserTz, wishDate };
}

async function sendWish(wish: WishSentLog, wishLogRepo: Repository<WishSentLog>) {
  const user = wish.user;
  wish.status = WishStatus.SENT;
  await wishLogRepo.save(wish);
  try {
    const response = await axios.post('https://your-birthday-wish-endpoint.com/send', {
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      timezone: user.timezone,
    });
    if (response.status >= 200 && response.status < 300) {
      console.log(`Sent birthday wish to ${user.first_name} ${user.last_name}`);
    } else {
      await scheduleRetry(wish, wishLogRepo, new Error(`Received status ${response.status}`));
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await scheduleRetry(wish, wishLogRepo, new Error(errorMessage));
  }
}

async function scheduleRetry(wish: WishSentLog, wishLogRepo: Repository<WishSentLog>, error: Error) {
  const user = wish.user;
  try {
    wish.status = WishStatus.FAILED;
    await wishLogRepo.save(wish);
    const retryWish = wishLogRepo.create({
      user: user,
      type: WishType.BIRTHDAY,
      status: WishStatus.PENDING,
      sendDate: DateTime.fromJSDate(wish.sendDate).plus({ hours: 1 }).toJSDate(),
    });
    await wishLogRepo.save(retryWish);
    console.error(`Failed to send birthday wish to ${user.first_name} ${user.last_name}:`, error, 'Retry scheduled in 1 hour.');
  } catch (dbErr) {
    console.error(`Failed to update wish status or schedule retry for ${user.first_name} ${user.last_name}:`, dbErr);
  }
}

export async function sendBirthdayWishesCron() {
  const wishLogRepo = AppDataSource.getRepository(WishSentLog);
  const now = DateTime.now();
  const pendingWishes = await wishLogRepo.createQueryBuilder('wish')
    .leftJoinAndSelect('wish.user', 'user')
    .where('wish.type = :type', { type: WishType.BIRTHDAY })
    .andWhere('wish.status = :status', { status: WishStatus.PENDING })
    .andWhere('wish.sendDate <= :now', { now: now.toJSDate() })
    .orderBy('wish.sendDate', 'ASC')
    .take(500)
    .getMany();

  const limit = pLimit(10);
  const sendTasks = pendingWishes.map(wish => limit(async () => {
    const { canSend } = shouldSendWish(wish, DateTime.now().toUTC());
    if (canSend) {
      await sendWish(wish, wishLogRepo);
    }
  }));
  await Promise.all(sendTasks);
}
