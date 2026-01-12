import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

import { CHAT_TYPE } from '../../domain/entities/chat.entity';
import { ChatMembersModel } from 'src/chat-members/infrastructure/orm/chat-members.model';

@Table({ tableName: 'group-chat' })
export class GroupChatModel extends Model<GroupChatModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM(CHAT_TYPE.GROUP),
    allowNull: false,
    defaultValue: CHAT_TYPE.GROUP,
  })
  type: typeof CHAT_TYPE.GROUP;

  @HasMany(() => ChatMembersModel)
  members: ChatMembersModel[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  unreadCount?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  creatorId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  avatar?: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
