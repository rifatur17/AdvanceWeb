import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./common/configure-app";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3000), "127.0.0.1");
}

bootstrap().catch(() => {
  console.error("Application startup failed. Check PostgreSQL and your local .env settings.");
  process.exitCode = 1;
});
