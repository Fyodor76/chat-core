import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: string;
  requestId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  trace?: string;
}

@Injectable()
export class LokiLoggerService {
  private lokiUrl: string;
  private labels: Record<string, string>;

  constructor() {
    this.lokiUrl = process.env.LOKI_URL || 'http://loki:3100';
    this.labels = {
      app: 'solitude-core',
      environment: process.env.NODE_ENV || 'production',
      job: 'nestjs-backend',
      service_name: 'solitude-core-backend',
    };
  }

  async sendToLoki(logEntry: LogEntry) {
    try {
      const timestampNs = (Date.now() * 1000000).toString();

      const logStream = {
        stream: this.labels,
        values: [[timestampNs, JSON.stringify(logEntry)]],
      };

      await axios.post(
        `${this.lokiUrl}/loki/api/v1/push`,
        {
          streams: [logStream],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );
    } catch (error) {
      console.error('❌ Loki send error:', error.message);
    }
  }

  log(message: string, context?: string, metadata?: any) {
    const finalContext = metadata?.context || context || 'App';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context: _, ...cleanMetadata } = metadata || {};

    this.sendToLoki({
      level: 'info',
      message: message,
      context: finalContext,
      timestamp: new Date().toISOString(),
      metadata: cleanMetadata,
    });
  }

  error(message: string, trace?: string, context?: string, metadata?: any) {
    const finalContext = metadata?.context || context || 'App';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context: _, ...cleanMetadata } = metadata || {};

    this.sendToLoki({
      level: 'error',
      message: message,
      context: finalContext,
      trace,
      timestamp: new Date().toISOString(),
      metadata: cleanMetadata,
    });
  }

  warn(message: string, context?: string, metadata?: any) {
    const finalContext = metadata?.context || context || 'App';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context: _, ...cleanMetadata } = metadata || {};

    this.sendToLoki({
      level: 'warn',
      message: message,
      context: finalContext,
      timestamp: new Date().toISOString(),
      metadata: cleanMetadata,
    });
  }

  debug(message: string, context?: string, metadata?: any) {
    const finalContext = metadata?.context || context || 'App';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context: _, ...cleanMetadata } = metadata || {};

    this.sendToLoki({
      level: 'debug',
      message: message,
      context: finalContext,
      timestamp: new Date().toISOString(),
      metadata: cleanMetadata,
    });
  }
}
