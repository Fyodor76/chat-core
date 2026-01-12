import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatMembersRepository } from 'src/chat-members/domain/repository/chat-members.repository';
import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import { ChatMembersModel } from '../orm/chat-members.model';
import { UserModel } from 'src/users/infrastructure/orm/user.entity';
import { CHAT_TYPE, ChatType } from 'src/chat/domain/entities/chat.entity';
import { ChatMembersMapper } from 'src/chat-members/application/mappers/chat-members';

@Injectable()
export class SequelizeChatMembersRepository implements ChatMembersRepository {
  constructor(
    @InjectModel(ChatMembersModel)
    private readonly chatMembersModel: typeof ChatMembersModel,
  ) {}

  async addChatMembersByUsersIds(
    userIds: string[],
    chatId: string,
    chatType: ChatType,
  ): Promise<ChatMembersEntity[]> {
    const members = await Promise.all(
      userIds.map(async (userId) => {
        const member = await this.chatMembersModel.create({
          userId,
          [chatType === CHAT_TYPE.DIRECT ? 'directChatId' : 'groupChatId']:
            chatId,
        });
        return member;
      }),
    );

    const membersWithUsers = await this.chatMembersModel.findAll({
      where: { id: members.map((m) => m.id) },
      include: [UserModel],
    });

    return ChatMembersMapper.toDomainArray(membersWithUsers);
  }

  async deleteChatMemberByUserId(
    userId: string,
    chatId: string,
    chatType: ChatType,
  ): Promise<void> {
    await this.chatMembersModel.destroy({
      where: {
        userId,
        [chatType === CHAT_TYPE.DIRECT ? 'directChatId' : 'groupChatId']:
          chatId,
      },
    });
  }

  async getChatMembers(
    chatId: string,
    chatType: ChatType,
  ): Promise<ChatMembersEntity[]> {
    const members = await this.chatMembersModel.findAll({
      where: {
        [chatType === CHAT_TYPE.DIRECT ? 'directChatId' : 'groupChatId']:
          chatId,
      },
      include: [UserModel],
    });

    return ChatMembersMapper.toDomainArray(members);
  }
}
