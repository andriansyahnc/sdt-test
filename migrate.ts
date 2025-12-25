import { AppDataSource } from './src/config/typeorm-data-source';

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    console.log('Migrations ran successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running migrations:', error);
    process.exit(1);
  });
