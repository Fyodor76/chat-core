import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mailer.service';
import { createMailerConfig } from '../config/mailer.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMailerConfig,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
