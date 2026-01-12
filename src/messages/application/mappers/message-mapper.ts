import { v4 as uuidv4 } from 'uuid';
import { MessageEntity } from '../../domain/entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/response-message.dto';

export class MessageMapper {
  static toEntity(dto: CreateMessageDto): MessageEntity {
    return new MessageEntity({
      id: uuidv4(),
      content: dto.content,
      senderId: dto.senderId,
      chatId: dto.chatId,
      chatType: dto.chatType,
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
    });
  }

  static toResponse(entity: MessageEntity): MessageResponseDto {
    const dto = new MessageResponseDto();

    dto.id = entity.id;
    dto.content = entity.content;
    dto.senderId = entity.senderId;
    dto.chatId = entity.chatId;
    dto.chatType = entity.chatType;
    dto.readBy = entity.readBy;
    dto.isRead = entity.readBy.length > 0;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    return dto;
  }
}
