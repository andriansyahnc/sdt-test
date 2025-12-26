import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
import { WishSentLog } from '../entities/WishSentLog.js';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [User, WishSentLog],
  synchronize: true,
  logging: false,
});
