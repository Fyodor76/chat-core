import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatRepository } from 'src/chat/domain/repository/chat.repository';
import { DirectChatModel } from '../orm/direct-chat.model';
import { GroupChatModel } from '../orm/group-chat.model';
import {
  CHAT_TYPE,
  DirectChatEntity,
  GroupChatEntity,
} from 'src/chat/domain/entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';
import { ChatMembersRepository } from 'src/chat-members/domain/repository/chat-members.repository';
import { CreateGroupChatDto } from 'src/chat/application/dto/create-group-chat.dto';
import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';

@Injectable()
export class SequelizeChatRepository implements ChatRepository {
  constructor(
    @InjectModel(DirectChatModel)
    private readonly directChatModel: typeof DirectChatModel,
    @InjectModel(GroupChatModel)
    private readonly groupChatModel: typeof GroupChatModel,
    @Inject('ChatMembersRepository')
    private readonly chatMembersRepository: ChatMembersRepository,
  ) {}

  async getDirectChatById(chatId: string): Promise<DirectChatEntity | null> {
    const chat = await this.directChatModel.findByPk(chatId);

    if (!chat) return null;

    const members = await this.chatMembersRepository.getChatMembers(
      chatId,
      CHAT_TYPE.DIRECT,
    );

    return new DirectChatEntity({
      id: chat.id,
      type: CHAT_TYPE.DIRECT,
      members,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      unreadCount: chat.unreadCount,
    });
  }

  async getGroupChatById(chatId: string): Promise<GroupChatEntity | null> {
    const chat = await this.groupChatModel.findByPk(chatId);

    if (!chat) return null;

    const members = await this.chatMembersRepository.getChatMembers(
      chatId,
      CHAT_TYPE.GROUP,
    );

    return new GroupChatEntity({
      id: chat.id,
      type: CHAT_TYPE.GROUP,
      members,
      name: chat.name,
      creatorId: chat.creatorId,
      avatar: chat.avatar,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      unreadCount: chat.unreadCount,
    });
  }

  async createDirectChat(userIds: string[]): Promise<DirectChatEntity> {
    const chat = await this.directChatModel.create({
      id: uuidv4(),
      type: CHAT_TYPE.DIRECT,
    });

    const members = await this.chatMembersRepository.addChatMembersByUsersIds(
      userIds,
      chat.id,
      CHAT_TYPE.DIRECT,
    );

    return new DirectChatEntity({
      id: chat.id,
      type: CHAT_TYPE.DIRECT,
      members,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  }

  async createGroupChat(
    groupChatDto: CreateGroupChatDto,
  ): Promise<GroupChatEntity> {
    const chat = await this.groupChatModel.create({
      id: uuidv4(),
      type: CHAT_TYPE.GROUP,
      name: groupChatDto.name,
      avatar: groupChatDto.avatar,
      creatorId: groupChatDto.creatorId,
    });

    const members = await this.chatMembersRepository.addChatMembersByUsersIds(
      groupChatDto.memberIds,
      chat.id,
      CHAT_TYPE.GROUP,
    );

    return new GroupChatEntity({
      id: chat.id,
      type: CHAT_TYPE.GROUP,
      members,
      name: chat.name,
      creatorId: chat.creatorId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  }

  async deleteChatById(chatId: string): Promise<void> {
    await this.directChatModel.destroy({ where: { id: chatId } });
    await this.groupChatModel.destroy({ where: { id: chatId } });
  }

  async addMembersToGroupChat(
    memberIds: string[],
    chatId: string,
  ): Promise<ChatMembersEntity[]> {
    const members = await this.chatMembersRepository.addChatMembersByUsersIds(
      memberIds,
      chatId,
      CHAT_TYPE.GROUP,
    );

    return members.map((m) => new ChatMembersEntity(m));
  }
}
