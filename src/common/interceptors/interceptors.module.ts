import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AllLogsInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AllLogsInterceptor,
    },
  ],
})
export class InterceptorsModule {}
