import { AppDataSource } from './data-source';

(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.runMigrations();
    // eslint-disable-next-line no-console
    console.log('Migrations executed successfully');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration run failed', err);
    process.exit(1);
  }
})();
