import { ChatMembersEntity } from '../entities/chat-members.entity';

export interface ChatMembersRepository {
  addChatMembersByUsersIds(
    userIds: string[],
    chatId: string,
    chatType: 'direct' | 'group',
  ): Promise<ChatMembersEntity[]> | null;
  deleteChatMemberByUserId(
    userId: string,
    chatId: string,
    chatType: 'direct' | 'group',
  ): void;
  getChatMembers(
    chatId: string,
    chatType: 'direct' | 'group',
  ): Promise<ChatMembersEntity[]>;
}
