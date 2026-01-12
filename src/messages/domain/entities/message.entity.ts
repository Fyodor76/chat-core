import { ChatType } from 'src/chat/domain/entities/chat.entity';

export interface MessageParams {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  chatType: ChatType;
  createdAt: Date;
  updatedAt: Date;
  readBy?: string[];
}

export class MessageEntity {
  public readonly id: string;
  public readonly content: string;
  public readonly senderId: string;
  public readonly chatId: string;
  public readonly chatType: ChatType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readBy: string[];

  constructor(params: MessageParams) {
    this.id = params.id;
    this.content = params.content;
    this.senderId = params.senderId;
    this.chatId = params.chatId;
    this.chatType = params.chatType;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.readBy = params.readBy || [];

    this.validate();
  }

  private validate(): void {
    if (!this.content?.trim()) {
      throw new Error('Message content is required');
    }
    if (this.content.length > 5000) {
      throw new Error('Message is too long');
    }
    if (!this.senderId) {
      throw new Error('Sender ID is required');
    }
    if (!this.chatId) {
      throw new Error('Chat ID is required');
    }
  }

  markAsRead(userId: string): void {
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId);
    }
  }

  isReadBy(userId: string): boolean {
    return this.readBy.includes(userId);
  }
}
