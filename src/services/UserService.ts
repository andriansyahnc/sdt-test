import User from '../models/User';
import { CreateUserDto } from '../dto/UserDto';

export class UserService {
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await User.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      location: dto.location,
      timezone: dto.timezone,
    });
    return user;
  }
}
