import { Inject, Injectable } from '@nestjs/common';
import { ChatMembersRepository } from '../domain/repository/chat-members.repository';
import { ChatType } from 'src/chat/domain/entities/chat.entity';

@Injectable()
export class ChatMembersApplication {
  constructor(
    @Inject('ChatMembersRepository')
    private readonly chatMembersRepository: ChatMembersRepository,
  ) {}

  async addMembersToChat(
    userIds: string[],
    chatId: string,
    chatType: ChatType,
  ) {
    return await this.chatMembersRepository.addChatMembersByUsersIds(
      userIds,
      chatId,
      chatType,
    );
  }

  async removeMemberFromChat(
    userId: string,
    chatId: string,
    chatType: ChatType,
  ) {
    await this.chatMembersRepository.deleteChatMemberByUserId(
      userId,
      chatId,
      chatType,
    );
  }

  async getChatMembers(chatId: string, chatType: ChatType) {
    return await this.chatMembersRepository.getChatMembers(chatId, chatType);
  }
}
