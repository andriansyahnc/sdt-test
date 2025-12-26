
import 'dotenv/config';
import { app } from './server.js';
import { AppDataSource } from './config/typeorm-data-source.js';
import './entities/User.js';
import { startWishScheduler } from './scheduler/wishJob.js';
import { config } from './config/appConfig.js';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    startWishScheduler();

    app.listen(config.app.port, () => {
      console.log(`Server running on port ${config.app.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
