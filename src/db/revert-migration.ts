import { AppDataSource } from './data-source';

(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.undoLastMigration();
    // eslint-disable-next-line no-console
    console.log('Last migration reverted');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Revert migration failed', err);
    process.exit(1);
  }
})();
