import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatApplication } from './application/chat.service';
import { SequelizeChatRepository } from './infrastructure/repositories/sequelize-chat.repository';
import { ChatMembersModule } from '../chat-members/chat-members.module';
import { DirectChatModel } from './infrastructure/orm/direct-chat.model';
import { GroupChatModel } from './infrastructure/orm/group-chat.model';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([DirectChatModel, GroupChatModel]),
    ChatMembersModule,
  ],
  providers: [
    SequelizeChatRepository,
    {
      provide: 'ChatRepository',
      useClass: SequelizeChatRepository,
    },
    ChatApplication,
  ],
  exports: [ChatApplication],
  controllers: [ChatController],
})
export class ChatModule {}
