import dataSource from "../config/database.config";

async function main(): Promise<void> {
  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log("Migration run completed");
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}
main().catch(() => {
  console.error("Migration failed. Check your local database settings and schema.");
  process.exitCode = 1;
});
