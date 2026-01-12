import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeChatMembersRepository } from './infrastructure/repositories/sequilize-chat-members.repository';
import { ChatMembersModel } from './infrastructure/orm/chat-members.model';
import { ChatMembersApplication } from './application/chat-members.service';

@Module({
  imports: [SequelizeModule.forFeature([ChatMembersModel])],
  providers: [
    {
      provide: 'ChatMembersRepository',
      useClass: SequelizeChatMembersRepository,
    },
    ChatMembersApplication,
  ],
  exports: ['ChatMembersRepository', ChatMembersApplication],
})
export class ChatMembersModule {}
