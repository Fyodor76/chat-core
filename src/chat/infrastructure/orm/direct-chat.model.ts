import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

import { CHAT_TYPE } from '../../domain/entities/chat.entity';
import { ChatMembersModel } from 'src/chat-members/infrastructure/orm/chat-members.model';

@Table({ tableName: 'direct-chat' })
export class DirectChatModel extends Model<DirectChatModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM(CHAT_TYPE.DIRECT),
    allowNull: false,
    defaultValue: CHAT_TYPE.DIRECT,
  })
  type: typeof CHAT_TYPE.DIRECT;

  @HasMany(() => ChatMembersModel)
  members: ChatMembersModel[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  unreadCount?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
