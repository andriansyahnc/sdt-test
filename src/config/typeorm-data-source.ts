import 'dotenv/config';
import { config } from './appConfig.js';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import path from 'path';
import { User } from '../entities/User.js';
import { WishSentLog } from '../entities/WishSentLog.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,
  entities: [User, WishSentLog],
  migrations: [path.join(dirname, '../migrations/*.ts')],
  synchronize: false,
  logging: false,
  timezone: 'Z',
});
