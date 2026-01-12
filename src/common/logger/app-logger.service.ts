import { Injectable, Inject } from '@nestjs/common';
import { LokiLoggerService } from './loki-logger.service';

@Injectable()
export class AppLogger {
  constructor(
    @Inject(LokiLoggerService)
    private readonly lokiLogger: LokiLoggerService,
  ) {}

  error(message: string, trace?: string, metadata?: any) {
    const context = metadata?.context || 'App';

    this.lokiLogger.error(message, trace, context, metadata);

    console.error(
      `[${context}] ${message}`,
      trace ? `\n${trace}` : '',
      metadata ? `\n${JSON.stringify(metadata, null, 2)}` : '',
    );
  }

  warn(message: string, metadata?: any) {
    const context = metadata?.context || 'App';

    this.lokiLogger.warn(message, context, metadata);
    console.warn(
      `[${context}] ${message}`,
      metadata ? `\n${JSON.stringify(metadata, null, 2)}` : '',
    );
  }

  log(message: string, metadata?: any) {
    const context = metadata?.context || 'App';

    this.lokiLogger.log(message, context, metadata);
    console.log(
      `[${context}] ${message}`,
      metadata ? `\n${JSON.stringify(metadata, null, 2)}` : '',
    );
  }

  debug(message: string, metadata?: any) {
    const context = metadata?.context || 'App';

    this.lokiLogger.debug(message, context, metadata);
    console.debug(
      `[${context}] ${message}`,
      metadata ? `\n${JSON.stringify(metadata, null, 2)}` : '',
    );
  }

  custom(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata?: any,
  ) {
    const context = metadata?.context || 'App';

    switch (level) {
      case 'info':
        this.log(message, { ...metadata, context });
        break;
      case 'warn':
        this.warn(message, { ...metadata, context });
        break;
      case 'error':
        this.error(message, undefined, { ...metadata, context });
        break;
      case 'debug':
        this.debug(message, { ...metadata, context });
        break;
    }
  }
}
