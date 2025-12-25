
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Password',
  database: process.env.DB_NAME || 'birthday_wishes',
  entities: [path.join(dirname, '../entities/*.ts')],
  migrations: [path.join(dirname, '../migrations/*.ts')],
  synchronize: false,
  logging: false,
});
