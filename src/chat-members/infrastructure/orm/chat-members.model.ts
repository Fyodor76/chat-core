import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DirectChatModel } from 'src/chat/infrastructure/orm/direct-chat.model';
import { GroupChatModel } from 'src/chat/infrastructure/orm/group-chat.model';
import { UserModel } from 'src/users/infrastructure/orm/user.entity';

@Table({ tableName: 'chat_members' })
export class ChatMembersModel extends Model<ChatMembersModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => DirectChatModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  directChatId?: string;

  @ForeignKey(() => GroupChatModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  groupChatId?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  joinedAt: Date;
}
