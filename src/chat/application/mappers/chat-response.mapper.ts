import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import {
  DirectChatEntity,
  GroupChatEntity,
} from '../../domain/entities/chat.entity';
import {
  ChatMemberResponseDto,
  DirectChatResponseDto,
} from '../dto/chat-response.dto';

export class ChatResponseMapper {
  static chatMemberToResponse(
    member: ChatMembersEntity,
  ): ChatMemberResponseDto {
    return {
      id: member.id,
      user: {
        id: member.user.id,
        login: member.user.login,
      },
    };
  }

  static directChatToResponse(chat: DirectChatEntity): DirectChatResponseDto {
    return {
      id: chat.id,
      type: chat.type,
      members: chat.members.map((member) => this.chatMemberToResponse(member)),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      unreadCount: chat.unreadCount,
    };
  }

  static groupChatToResponse(chat: GroupChatEntity) {
    return {
      id: chat.id,
      type: chat.type,
      name: chat.name,
      creatorId: chat.creatorId,
      avatar: chat.avatar,
      members: chat.members.map((member) => this.chatMemberToResponse(member)),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      unreadCount: chat.unreadCount,
      canManage: chat.canUserManage(chat.creatorId),
    };
  }
}
