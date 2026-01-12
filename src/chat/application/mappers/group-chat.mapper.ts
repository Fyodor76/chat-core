import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import {
  CHAT_TYPE,
  GroupChatEntity,
} from 'src/chat/domain/entities/chat.entity';
import { GroupChatModel } from 'src/chat/infrastructure/orm/group-chat.model';

export class GroupChatMapper {
  static toDomain(
    chatModel: GroupChatModel,
    members: ChatMembersEntity[],
  ): GroupChatEntity {
    return new GroupChatEntity({
      id: chatModel.id,
      type: CHAT_TYPE.GROUP,
      members,
      name: chatModel.name,
      creatorId: chatModel.creatorId,
      avatar: chatModel.avatar,
      createdAt: chatModel.createdAt,
      updatedAt: chatModel.updatedAt,
      unreadCount: chatModel.unreadCount || 0,
    });
  }

  static toPersistence(chat: GroupChatEntity): Partial<GroupChatModel> {
    return {
      id: chat.id,
      type: CHAT_TYPE.GROUP,
      name: chat.name,
      creatorId: chat.creatorId,
      avatar: chat.avatar,
      unreadCount: chat.unreadCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
