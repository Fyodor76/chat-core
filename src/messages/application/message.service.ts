import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../domain/repository/message.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageMapper } from './mappers/message-mapper';
import { MessageResponseDto } from './dto/response-message.dto';

@Injectable()
export class MessageApplication {
  constructor(
    @Inject('MessageRepository')
    private readonly messageRepository: MessageRepository,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<MessageResponseDto> {
    const message = MessageMapper.toEntity(dto);
    const saved = await this.messageRepository.save(message);
    return MessageMapper.toResponse(saved);
  }

  async getMessage(messageId: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
    return MessageMapper.toResponse(message);
  }

  async getChatMessages(
    chatId: string,
    limit: number = 50,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.messageRepository.findByChatId(chatId, limit);
    return messages.map((msg) => MessageMapper.toResponse(msg));
  }

  async deleteMessage(messageId: string): Promise<string> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
    await this.messageRepository.delete(messageId);
    return messageId;
  }

  async markMessageAsRead(
    messageId: string,
    userId: string,
  ): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
    message.markAsRead(userId);
    await this.messageRepository.markAsRead(messageId, userId);
    return MessageMapper.toResponse(message);
  }
}
