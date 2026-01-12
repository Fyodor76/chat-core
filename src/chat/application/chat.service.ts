import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../domain/repository/chat.repository';
import { CreateDirectChatDto } from './dto/create-direct-chat.dto';
import { ChatResponseMapper } from './mappers/chat-response.mapper';
import {
  ChatMemberResponseDto,
  DirectChatResponseDto,
  GroupChatResponseDto,
} from './dto/chat-response.dto';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';

@Injectable()
export class ChatApplication {
  constructor(
    @Inject('ChatRepository')
    private readonly chatRepository: ChatRepository,
  ) {}

  async createDirectChat(
    dto: CreateDirectChatDto,
  ): Promise<DirectChatResponseDto> {
    const chat = await this.chatRepository.createDirectChat(dto.memberIds);

    return ChatResponseMapper.directChatToResponse(chat);
  }

  async createGroupChat(
    dto: CreateGroupChatDto,
  ): Promise<GroupChatResponseDto> {
    const chat = await this.chatRepository.createGroupChat(dto);

    return ChatResponseMapper.groupChatToResponse(chat);
  }

  async getDirectChatById(chatId: string): Promise<DirectChatResponseDto> {
    const chat = await this.chatRepository.getDirectChatById(chatId);

    return ChatResponseMapper.directChatToResponse(chat);
  }

  async getGroupChatById(chatId: string): Promise<GroupChatResponseDto> {
    const chat = await this.chatRepository.getGroupChatById(chatId);

    return ChatResponseMapper.groupChatToResponse(chat);
  }

  async addMembersToGroupChat(
    memberIds: string[],
    chatId: string,
  ): Promise<ChatMemberResponseDto[]> {
    const members = await this.chatRepository.addMembersToGroupChat(
      memberIds,
      chatId,
    );

    return members.map((m) => ChatResponseMapper.chatMemberToResponse(m));
  }
}
