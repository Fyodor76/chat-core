import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CHAT_TYPE, ChatType } from 'src/chat/domain/entities/chat.entity';
import { UserModel } from 'src/users/infrastructure/orm/user.entity';

@Table({ tableName: 'messages' })
export class MessageModel extends Model<MessageModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'sender_id',
  })
  senderId: string;

  @BelongsTo(() => UserModel)
  sender: UserModel;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'chat_id',
  })
  chatId: string;

  @Column({
    type: DataType.ENUM(...Object.values(CHAT_TYPE)),
    allowNull: false,
    field: 'chat_type',
  })
  chatType: ChatType;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    defaultValue: [],
    field: 'read_by',
  })
  readBy: string[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  updatedAt: Date;
}
