import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError, TypeORMError } from "typeorm";

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception instanceof QueryFailedError
      ? (exception.driverError as { code?: string }).code : undefined;
    let statusCode = 500;
    let message = "Database operation failed";
    if (code === "23505") {
      statusCode = 409;
      message = "A record with these values already exists";
    } else if (["23502", "23514", "22P02", "22003"].includes(code || "")) {
      statusCode = 400;
      message = "Values do not satisfy database constraints";
    }
    // Do not return SQL, parameters, connection settings, or dummy passwords.
    this.logger.error(`Database operation failed (${code || "unknown"})`);
    response.status(statusCode).json({ statusCode, message });
  }
}
