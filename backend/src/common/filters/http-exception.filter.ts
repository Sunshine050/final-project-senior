import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

interface ExceptionResponseObject {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Ignore common frontend routes that don't exist in backend
    const ignoredRoutes = ['/login', '/register', '/dashboard'];
    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.NOT_FOUND &&
      ignoredRoutes.some((route) => request.url === route || request.url.startsWith(route + '/'))
    ) {
      // Return 204 No Content for ignored routes (common frontend routes)
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as ExceptionResponseObject;
        message = responseObj.message
          ? Array.isArray(responseObj.message)
            ? responseObj.message.join(', ')
            : responseObj.message
          : exception.message;
        error = responseObj.error || exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    });
  }
}

