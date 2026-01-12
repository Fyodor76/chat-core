import { MessageEntity } from 'src/messages/domain/entities/message.entity';

export interface MessageRepository {
  save(message: MessageEntity): Promise<MessageEntity>;
  findById(messageId: string): Promise<MessageEntity | null>;
  findByChatId(chatId: string, limit?: number): Promise<MessageEntity[]>;
  markAsRead(messageId: string, userId: string): Promise<void>;
  delete(messageId: string): Promise<void>;
}
