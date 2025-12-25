import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Password',
    name: process.env.DB_NAME || 'birthday_wishes',
  },
  wish: {
    sendConcurrency: parseInt(process.env.WISH_SEND_CONCURRENCY || '10'),
    sendBatchSize: parseInt(process.env.WISH_SEND_BATCH_SIZE || '500'),
    sendHourStart: parseInt(process.env.WISH_SEND_HOUR_START || '9'),
    sendHourEnd: parseInt(process.env.WISH_SEND_HOUR_END || '17'),
    endpoint: process.env.WISH_SEND_ENDPOINT || 'https://your-birthday-wish-endpoint.com/send',
  },
  app: {
    port: parseInt(process.env.PORT || '3000'),
  },
};
