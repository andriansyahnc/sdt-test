import { AppDataSource } from '../config/typeorm-data-source.js';
import { User } from '../entities/User.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { CreateUserDto } from '../dto/UserDto.js';
import { getNextWishes } from '../utils/dateUtils.js';

export class UserService {
  async createUser(dto: CreateUserDto): Promise<User> {
    const userRepo = AppDataSource.getRepository(User);
    
    const user = userRepo.create({
      first_name: dto.firstName,
      last_name: dto.lastName,
      email: dto.email,
      date_of_birth: new Date(dto.dateOfBirth),
      location: dto.location,
      timezone: dto.timezone,
    });
    await userRepo.save(user);

    return user;
  }

  async updateUser(id: number, dto: CreateUserDto): Promise<User> {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);
      const user = await userRepo.findOneBy({ id: id });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      user.first_name = dto.firstName;
      user.last_name = dto.lastName;
      user.email = dto.email;
      user.date_of_birth = new Date(dto.dateOfBirth);
      user.location = dto.location;
      user.timezone = dto.timezone;
      await userRepo.save(user);

      const wishLogRepo = transactionalEntityManager.getRepository(WishSentLog);
      const existingLog = await wishLogRepo.findOne({
        where: {
          user: { id: user.id },
          type: WishType.BIRTHDAY,
          status: WishStatus.PENDING,
        },
      });

      if (existingLog) {
        const nextBirthday = getNextWishes(dto.dateOfBirth, dto.timezone, 9);
        existingLog.sendDate = nextBirthday.toUTC().toJSDate();
        await wishLogRepo.save(existingLog);
      }

      return user;
    });
  }

  async deleteUser(userId: number): Promise<User | null> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      return null;
    }
    await userRepo.remove(user);
    return user;
  }
}
