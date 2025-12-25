
import { AppDataSource } from '../config/typeorm-data-source.js';
import { User } from '../entities/User.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { CreateUserDto } from '../dto/UserDto.js';
import { DateTime } from 'luxon';

export class UserService {
  async createUser(dto: CreateUserDto): Promise<User> {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);
      const wishLogRepo = transactionalEntityManager.getRepository(WishSentLog);

      const user = userRepo.create({
        first_name: dto.firstName,
        last_name: dto.lastName,
        date_of_birth: dto.dateOfBirth,
        location: dto.location,
        timezone: dto.timezone,
      });
      await userRepo.save(user);

      const now = DateTime.utc();
      const birthDate = DateTime.fromISO(dto.dateOfBirth, { zone: dto.timezone });
      let nextBirthday = birthDate.set({ year: now.year });
      if (nextBirthday < now.setZone(dto.timezone)) {
        nextBirthday = nextBirthday.plus({ years: 1 });
      }
      nextBirthday = nextBirthday.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const wishDate = nextBirthday.toUTC().toJSDate();

      const existingLog = await wishLogRepo.findOne({
        where: {
          user: { id: user.id },
          type: WishType.BIRTHDAY,
          status: WishStatus.PENDING,
        },
      });
      if (existingLog) {
        existingLog.sendDate = wishDate;
        await wishLogRepo.save(existingLog);
      } else {
        const wishLog = wishLogRepo.create({
          user,
          type: WishType.BIRTHDAY,
          status: WishStatus.PENDING,
          sendDate: wishDate,
        });
        await wishLogRepo.save(wishLog);
      }
      return user;
    });
  }
}
