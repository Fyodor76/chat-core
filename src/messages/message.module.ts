import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageApplication } from './application/message.service';
import { SequelizeMessageRepository } from './infrastructure/repositories/sequelize-message.repository';
import { MessageModel } from './infrastructure/orm/message.model';
import { MessageController } from './message.controller';

@Module({
  imports: [SequelizeModule.forFeature([MessageModel])],
  providers: [
    MessageApplication,
    {
      provide: 'MessageRepository',
      useClass: SequelizeMessageRepository,
    },
  ],
  controllers: [MessageController],
  exports: [MessageApplication],
})
export class MessageModule {}
