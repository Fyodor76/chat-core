import { ChatMembersEntity } from '../../domain/entities/chat-members.entity';
import { ChatMembersModel } from '../../infrastructure/orm/chat-members.model';

export class ChatMembersMapper {
  static toDomain(model: ChatMembersModel): ChatMembersEntity {
    return new ChatMembersEntity({
      id: model.id,
      user: model.user,
    });
  }

  static toDomainArray(models: ChatMembersModel[]): ChatMembersEntity[] {
    return models.map((model) => this.toDomain(model));
  }
}
