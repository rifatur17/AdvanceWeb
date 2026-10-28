import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DatabaseExceptionFilter } from "./filters/database-exception.filter";

export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new DatabaseExceptionFilter());
}
