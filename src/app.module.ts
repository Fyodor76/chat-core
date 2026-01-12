import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { createDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mailer/mailer.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { ChatModule } from './chat/chat.module';
import { ChatMembersModule } from './chat-members/chat-members.module';
import { MessageModule } from './messages/message.module';
import { SocketModule } from './socket/socket.module';
import { TokenModule } from './common/tokens/token.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    RedisModule,
    MailModule,
    LoggerModule,
    TokenModule,
    AuthModule,
    FileStorageModule,
    InterceptorsModule,
    ChatMembersModule,
    ChatModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
