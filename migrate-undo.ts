import { AppDataSource } from './src/config/typeorm-data-source';

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.undoLastMigration();
    console.log('Migration undo successful');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error undoing migration:', error);
    process.exit(1);
  });
