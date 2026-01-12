import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageRepository } from '../../domain/repository/message.repository';
import { MessageEntity } from '../../domain/entities/message.entity';
import { MessageModel } from '../orm/message.model';
import { throwNotFound } from 'src/common/exceptions/http-exception.helper';

@Injectable()
export class SequelizeMessageRepository implements MessageRepository {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
  ) {}

  async save(message: MessageEntity): Promise<MessageEntity> {
    const saved = await this.messageModel.create({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      chatId: message.chatId,
      chatType: message.chatType,
      readBy: message.readBy,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });

    return this.toEntity(saved);
  }

  async findById(messageId: string): Promise<MessageEntity | null> {
    const message = await this.messageModel.findByPk(messageId);
    if (!message) return null;
    return this.toEntity(message);
  }

  async findByChatId(
    chatId: string,
    limit: number = 50,
  ): Promise<MessageEntity[]> {
    const messages = await this.messageModel.findAll({
      where: { chatId },
      limit,
      order: [['createdAt', 'DESC']],
    });

    return messages.map((msg) => this.toEntity(msg));
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    const message = await this.messageModel.findByPk(messageId);

    if (!message) {
      throwNotFound(`Message ${messageId} not found`);
    }

    const readBy = message.readBy || [];

    if (!readBy.includes(userId)) {
      readBy.push(userId);

      await this.messageModel.update(
        {
          readBy,
          updatedAt: new Date(),
        },
        { where: { id: messageId } },
      );
    }
  }

  async delete(messageId: string): Promise<void> {
    await this.messageModel.destroy({ where: { id: messageId } });
  }

  private toEntity(model: MessageModel): MessageEntity {
    return new MessageEntity({
      id: model.id,
      content: model.content,
      senderId: model.senderId,
      chatId: model.chatId,
      chatType: model.chatType,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      readBy: model.readBy || [],
    });
  }
}
