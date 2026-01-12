import { CreateGroupChatDto } from 'src/chat/application/dto/create-group-chat.dto';
import { DirectChatEntity, GroupChatEntity } from '../entities/chat.entity';
import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';

export interface ChatRepository {
  getDirectChatById(chatId: string): Promise<DirectChatEntity> | null;
  createDirectChat(ids: string[]): Promise<DirectChatEntity>;
  createGroupChat(groupChatDto: CreateGroupChatDto): Promise<GroupChatEntity>;
  // updateDirectChat(chat: DirectChatEntity): Promise<DirectChatEntity>;
  // createGroupChat(chat: GroupChatEntity): Promise<GroupChatEntity>;
  getGroupChatById(chatId: string): Promise<GroupChatEntity> | null;
  // updateGroupChat(chat: DirectChatEntity): Promise<GroupChatEntity>;
  addMembersToGroupChat(
    memberIds: string[],
    chatId: string,
  ): Promise<ChatMembersEntity[]>;
  deleteChatById(chatId: string): Promise<void>;
}
