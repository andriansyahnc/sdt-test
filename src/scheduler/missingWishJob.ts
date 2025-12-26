import cron from 'node-cron';
import { AppDataSource } from '../config/typeorm-data-source.js';
import { User } from '../entities/User.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { getNextWishes } from '../utils/dateUtils.js';

export async function createMissingBirthdayWishes() {
  const userRepo = AppDataSource.getRepository(User);
  const wishLogRepo = AppDataSource.getRepository(WishSentLog);

  const users = await userRepo
    .createQueryBuilder('user')
    .leftJoin(
      WishSentLog,
      'wish',
      'wish.userId = user.id AND wish.type = :type AND wish.status = :status',
      { type: WishType.BIRTHDAY, status: WishStatus.PENDING }
    )
    .where('wish.id IS NULL')
    .getMany();

  for (const user of users) {
    const nextBirthday = getNextWishes(
      user.date_of_birth instanceof Date
        ? user.date_of_birth.toISOString().slice(0, 10)
        : user.date_of_birth,
      user.timezone,
      9
    );
    const wishLog = wishLogRepo.create({
      user,
      type: WishType.BIRTHDAY,
      status: WishStatus.PENDING,
      sendDate: nextBirthday.toUTC().toJSDate(),
    });
    await wishLogRepo.save(wishLog);
  }
}
