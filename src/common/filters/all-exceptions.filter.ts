import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.getErrorInfo(exception);

    this.logger.error(
      `HTTP Error ${status} on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }

  private getErrorInfo(exception: unknown): {
    status: number;
    message: string;
  } {
    // 1. HTTP исключения
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string' ? response : (response as any).message;
      return { status, message };
    }

    // 2. Ошибки базы данных (проверяем по имени)
    if (exception instanceof Error && 'name' in exception) {
      const errorName = (exception as any).name;
      const errorMessage = exception.message;

      // Sequelize ошибки
      if (
        errorName === 'SequelizeDatabaseError' ||
        errorName === 'SequelizeUniqueConstraintError' ||
        errorName === 'SequelizeForeignKeyConstraintError'
      ) {
        return this.handleDatabaseError(exception, errorMessage);
      }
    }

    // 3. Обычные Error
    if (exception instanceof Error) {
      return this.handleGenericError(exception);
    }

    // 4. Неизвестные ошибки
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private handleDatabaseError(
    exception: Error,
    errorMessage: string,
  ): { status: number; message: string } {
    const messageLower = errorMessage.toLowerCase();

    // UUID ошибка
    if (messageLower.includes('invalid input syntax for type uuid')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid ID format (not a valid UUID)',
      };
    }

    // Дубликат
    if (messageLower.includes('duplicate key')) {
      const match = errorMessage.match(
        /Key \((.+?)\)=\((.+?)\) already exists/i,
      );
      return {
        status: HttpStatus.CONFLICT,
        message: match
          ? `${match[1]} '${match[2]}' already exists`
          : 'Duplicate entry found',
      };
    }

    // Внешний ключ
    if (messageLower.includes('foreign key constraint')) {
      const match = errorMessage.match(
        /Key \((.+?)\)=\((.+?)\) is not present/i,
      );
      return {
        status: HttpStatus.BAD_REQUEST,
        message: match
          ? `Referenced ${match[1]} '${match[2]}' not found`
          : 'Referenced entity not found',
      };
    }

    // Остальные ошибки БД
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error occurred',
    };
  }

  private handleGenericError(exception: Error): {
    status: number;
    message: string;
  } {
    const message = exception.message.toLowerCase();

    // Доменные ошибки валидации
    if (
      message.includes('validation failed') ||
      message.includes('is required')
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
    }

    // Конфликты
    if (message.includes('already exists') || message.includes('duplicate')) {
      return {
        status: HttpStatus.CONFLICT,
        message: exception.message,
      };
    }

    // Не найдено
    if (message.includes('not found')) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: exception.message,
      };
    }

    // Остальные ошибки
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
    };
  }
}
