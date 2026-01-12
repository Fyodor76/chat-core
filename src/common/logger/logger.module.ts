import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLogger } from './app-logger.service';
import { LokiLoggerService } from './loki-logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AppLogger, LokiLoggerService],
  exports: [AppLogger, LokiLoggerService],
})
export class LoggerModule {}
