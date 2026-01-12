import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class AllLogsInterceptor implements NestInterceptor {
  private requestId: string;

  constructor(private readonly appLogger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const type = context.getType();

    if (type === 'http') {
      return this.interceptHttp(context, next);
    }
    if (type === 'ws') {
      return this.interceptWebSocket(context, next);
    }

    return next.handle();
  }

  private interceptHttp(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, url, ip, body, query, params } = request;
    const userAgent = request.headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    this.appLogger.log(`📥 ${method} ${url}`, {
      context: 'HTTP',
      requestId: this.requestId,
      type: 'request_start',
      method,
      url,
      ip,
      userAgent,
      body: this.maskSensitiveData(body),
      query,
      params,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;

          this.appLogger.log(
            `✅ ${method} ${url} - ${response.statusCode} (${duration}ms)`,
            {
              context: 'HTTP',
              requestId: this.requestId,
              type: 'request_complete',
              method,
              url,
              statusCode: response.statusCode,
              duration: `${duration}ms`,
              responseSize: this.safeGetResponseSize(data),
            },
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.appLogger.error(
            `${method} ${url} - ${error.status || 500} (${duration}ms)`,
            error.stack,
            {
              context: 'HTTP',
              requestId: this.requestId,
              type: 'request_error',
              method,
              url,
              statusCode: error.status || 500,
              duration: `${duration}ms`,
              errorMessage: error.message,
            },
          );
        },
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  private interceptWebSocket(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToWs();
    const client = ctx.getClient();
    const handlerName = context.getHandler().name;
    const data = ctx.getData();

    const startTime = Date.now();

    this.appLogger.log(`🔌 WebSocket: ${handlerName}`, {
      context: 'WebSocket',
      requestId: this.requestId,
      type: 'websocket_start',
      clientId: client.id,
      event: handlerName,
      data: this.safeStringify(data),
    });

    return next.handle().pipe(
      tap({
        next: (result) => {
          const duration = Date.now() - startTime;

          this.appLogger.log(`✅ WebSocket: ${handlerName} (${duration}ms)`, {
            context: 'WebSocket',
            requestId: this.requestId,
            type: 'websocket_complete',
            event: handlerName,
            duration: `${duration}ms`,
            resultType: this.getType(result),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.appLogger.error(
            `WebSocket: ${handlerName} (${duration}ms)`,
            error.stack,
            {
              context: 'WebSocket',
              requestId: this.requestId,
              type: 'websocket_error',
              event: handlerName,
              duration: `${duration}ms`,
              errorMessage: error.message,
            },
          );
        },
      }),
    );
  }

  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
      'authorization',
      'creditCard',
      'cvv',
      'ssn',
      'email',
    ];

    try {
      const masked = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (sensitiveFields.includes(key) && value) {
            return '***MASKED***';
          }
          return value;
        }),
      );
      return masked;
    } catch (error) {
      return {
        __type: 'Object',
        error: 'Cannot serialize due to circular references',
      };
    }
  }

  private safeGetResponseSize(data: any): string {
    try {
      const cleanData = this.removeCircularReferences(data);
      const json = JSON.stringify(cleanData);
      const bytes = Buffer.byteLength(json, 'utf8');
      if (bytes < 1024) return `${bytes} байт`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return 'неизвестно';
    }
  }

  private removeCircularReferences(obj: any, seen = new WeakSet()): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (seen.has(obj)) {
      return '[Circular]';
    }

    seen.add(obj);

    if (obj && obj._modelOptions) {
      return {
        __type: 'SequelizeModel',
        modelName: obj.name || obj.constructor.name,
        tableName: obj.tableName,
        dataValues: this.removeCircularReferences(obj.dataValues, seen),
      };
    }

    if (
      obj &&
      (obj.plain !== undefined || obj.raw !== undefined || obj.logging)
    ) {
      return {
        __type: 'SequelizeQueryObject',
        plain: obj.plain,
        raw: obj.raw,
        type: obj.type,
      };
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeCircularReferences(item, seen));
    }

    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (
          [
            'parent',
            'original',
            '_options',
            '_modelOptions',
            'associations',
          ].includes(key)
        ) {
          continue;
        }
        result[key] = this.removeCircularReferences(obj[key], seen);
      }
    }

    return result;
  }

  private safeStringify(obj: any): any {
    try {
      return JSON.parse(
        JSON.stringify(obj, (key, value) => {
          if (value && typeof value === 'object') {
            if (value._modelOptions) {
              return '[SequelizeModel]';
            }
          }
          return value;
        }),
      );
    } catch (error) {
      return { __type: 'Object', error: error.message };
    }
  }

  private getType(obj: any): string {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (Array.isArray(obj)) return `Array[${obj.length}]`;
    if (typeof obj === 'object') {
      if (obj._modelOptions) return 'SequelizeModel';
      if (obj.plain !== undefined) return 'SequelizeQuery';
      return `Object(${Object.keys(obj).length} keys)`;
    }
    return typeof obj;
  }
}
