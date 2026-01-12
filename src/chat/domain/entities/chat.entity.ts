import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import {
  throwDirectChatValidation,
  throwGroupChatValidation,
} from 'src/common/exceptions/ws-exception-helpers';

export const CHAT_TYPE = {
  DIRECT: 'direct' as const,
  GROUP: 'group' as const,
} as const;

export type ChatType = (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE];

export interface BaseChatParams {
  id: string;
  type: ChatType;
  members: ChatMembersEntity[];
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number;
}

export interface DirectChatParams extends BaseChatParams {
  type: typeof CHAT_TYPE.DIRECT;
}

export interface GroupChatParams extends BaseChatParams {
  type: typeof CHAT_TYPE.GROUP;
  name: string;
  creatorId: string;
  avatar?: string;
}

export abstract class ChatEntity {
  public readonly id: string;
  public readonly type: ChatType;
  public readonly members: ChatMembersEntity[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public unreadCount: number;

  constructor(params: BaseChatParams) {
    this.id = params.id;
    this.type = params.type;
    this.members = params.members;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.unreadCount = params.unreadCount || 0;
  }

  isMember(userId: string): boolean {
    return this.members.some((m) => m.user.id === userId);
  }

  getMemberIds(): string[] {
    return this.members.map((m) => m.user.id);
  }
}

export class DirectChatEntity extends ChatEntity {
  public readonly type: typeof CHAT_TYPE.DIRECT;
  constructor(params: DirectChatParams) {
    super({ ...params });
    this.type = CHAT_TYPE.DIRECT;
    if (params.members.length !== 2) {
      throwDirectChatValidation('Direct chat must have exactly 2 members');
    }
  }

  getOtherUser(currentUserId: string): ChatMembersEntity {
    const other = this.members.find((u) => u.user.id !== currentUserId);
    if (!other) {
      throwDirectChatValidation('User not found in chat');
    }
    return other;
  }
}

export class GroupChatEntity extends ChatEntity {
  public readonly name: string;
  public readonly creatorId: string;
  public readonly avatar?: string;
  public readonly type: typeof CHAT_TYPE.GROUP;

  constructor(params: GroupChatParams) {
    super({ ...params });
    this.type = CHAT_TYPE.GROUP;
    this.name = params.name;
    this.creatorId = params.creatorId;
    this.avatar = params.avatar;

    if (params.members.length < 2) {
      throwGroupChatValidation('Group chat must have at least 2 members');
    }
  }

  getCreator(): ChatMembersEntity | undefined {
    return this.members.find((m) => m.user.id === this.creatorId);
  }

  canUserManage(userId: string): boolean {
    return userId === this.creatorId;
  }
}
