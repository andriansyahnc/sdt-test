import { AppDataSource } from '../config/typeorm-data-source.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import axios from 'axios';
import pLimit from 'p-limit';
import { config } from '../config/appConfig.js';
import { getNext9am, getNextBirthday } from '../utils/dateUtils.js';

export function shouldSendWish(
  { sendDate, user }: { sendDate: Date; user: { timezone: string } },
  testTimeUtc?: DateTime,
): { canSend: boolean; now: DateTime; wishDate: DateTime } {
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
    let message;
    switch (wish.type) {
      case WishType.BIRTHDAY:
        message = `Hey, ${user.first_name} ${user.last_name} it's your birthday`;
        break;
      default:
        message = `Hello, ${user.first_name} ${user.last_name}`;
    }
    const response = await axios.post(config.wish.endpoint, {
      email: user.email,
      message,
    });
    if (response.status >= 200 && response.status < 300) {
      const nextBirthday = getNextBirthday(wish.user.date_of_birth, wish.user.timezone, 9);
      await createPendingWish(wish, wishLogRepo, {}, nextBirthday.toUTC().toJSDate());
    } else {
      await scheduleRetry(wish, wishLogRepo, new Error(`Received status ${response.status}`));
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await scheduleRetry(wish, wishLogRepo, new Error(errorMessage));
  }
}

async function createPendingWish(
  wish: WishSentLog,
  wishLogRepo: Repository<WishSentLog>,
  delay: { hours?: number; years?: number } = {},
  sendDate?: Date,
) {
  const nextSendDate = sendDate
    ? DateTime.fromJSDate(sendDate).toUTC().toJSDate()
    : DateTime.fromJSDate(wish.sendDate).plus(delay).toUTC().toJSDate();

  const retryWish = wishLogRepo.create({
    user: wish.user,
    type: wish.type,
    status: WishStatus.PENDING,
    sendDate: nextSendDate,
  });
  await wishLogRepo.save(retryWish);
}

async function scheduleRetry(
  wish: WishSentLog,
  wishLogRepo: Repository<WishSentLog>,
  error: Error,
  delay: { hours?: number; years?: number } = {},
  sendDate?: Date,
) {
  try {
    wish.status = WishStatus.FAILED;
    await wishLogRepo.save(wish);

    let nextSendDate: Date;
    if (sendDate && sendDate > new Date()) {
      nextSendDate = DateTime.fromJSDate(sendDate).toUTC().toJSDate();
    } else {
      nextSendDate = DateTime.fromJSDate(wish.sendDate).plus(delay).toUTC().toJSDate();
    }

    const retryWish = wishLogRepo.create({
      user: wish.user,
      type: wish.type,
      status: WishStatus.PENDING,
      sendDate: nextSendDate,
    });
    await wishLogRepo.save(retryWish);

    console.error(
      `Failed to send birthday wish to ${wish.user.first_name} ${wish.user.last_name}:`,
      error,
      `Retry scheduled at ${nextSendDate.toISOString()}.`,
    );
  } catch (dbErr) {
    console.error(
      `Failed to update wish status or schedule retry for ${wish.user.first_name} ${wish.user.last_name}:`,
      dbErr,
    );
  }
}

export async function sendWishesCron() {
  const wishLogRepo = AppDataSource.getRepository(WishSentLog);
  const now = DateTime.now();
  const pendingWishes = await wishLogRepo
    .createQueryBuilder('wish')
    .leftJoinAndSelect('wish.user', 'user')
    .andWhere('wish.status = :status', { status: WishStatus.PENDING })
    .andWhere('wish.sendDate <= :now', { now: now.toJSDate() })
    .orderBy('wish.sendDate', 'ASC')
    .take(100)
    .getMany();

  console.log(pendingWishes.length, 'pending wishes found to process at ', now.toISO());

  const limit = pLimit(10);
  const sendTasks = pendingWishes.map((wish) =>
    limit(async () => {
      const { canSend } = shouldSendWish(wish, DateTime.now().toUTC());
      if (canSend) {
        await sendWish(wish, wishLogRepo);
      } else {
        const nextAttempt = getNext9am(wish.user.timezone);
        await scheduleRetry(
          wish,
          wishLogRepo,
          new Error('Not within sending window'),
          {},
          nextAttempt.toUTC().toJSDate(),
        );
      }
    }),
  );
  await Promise.all(sendTasks);
}
