import { ChatMembersEntity } from 'src/chat-members/domain/entities/chat-members.entity';
import {
  DirectChatEntity,
  GroupChatEntity,
} from 'src/chat/domain/entities/chat.entity';
import { DirectChatModel } from 'src/chat/infrastructure/orm/direct-chat.model';
import { GroupChatModel } from 'src/chat/infrastructure/orm/group-chat.model';
import { DirectChatMapper } from './direct-chat.mapper';
import { GroupChatMapper } from './group-chat.mapper';

export class ChatMapper {
  static toDomain(
    chatModel: DirectChatModel | GroupChatModel,
    members: ChatMembersEntity[],
  ): DirectChatEntity | GroupChatEntity {
    if (chatModel.type === 'direct') {
      return DirectChatMapper.toDomain(chatModel as DirectChatModel, members);
    } else {
      return GroupChatMapper.toDomain(chatModel as GroupChatModel, members);
    }
  }
}

export { DirectChatMapper, GroupChatMapper };
