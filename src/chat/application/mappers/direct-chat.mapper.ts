import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import {
  CHAT_TYPE,
  DirectChatEntity,
} from 'src/chat/domain/entities/chat.entity';
import { DirectChatModel } from 'src/chat/infrastructure/orm/direct-chat.model';

export class DirectChatMapper {
  static toDomain(
    chatModel: DirectChatModel,
    members: ChatMembersEntity[],
  ): DirectChatEntity {
    return new DirectChatEntity({
      id: chatModel.id,
      type: CHAT_TYPE.DIRECT,
      members,
      createdAt: chatModel.createdAt,
      updatedAt: chatModel.updatedAt,
      unreadCount: chatModel.unreadCount || 0,
    });
  }

  static toPersistence(chat: DirectChatEntity): Partial<DirectChatModel> {
    return {
      id: chat.id,
      type: CHAT_TYPE.DIRECT,
      unreadCount: chat.unreadCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
