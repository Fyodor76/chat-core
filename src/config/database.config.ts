import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { UserModel } from '../users/infrastructure/orm/user.entity';
import { DirectChatModel } from 'src/chat/infrastructure/orm/direct-chat.model';
import { ChatMembersModel } from 'src/chat-members/infrastructure/orm/chat-members.model';
import { GroupChatModel } from 'src/chat/infrastructure/orm/group-chat.model';
import { MessageModel } from 'src/messages/infrastructure/orm/message.model';

export const createDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: 'postgres',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  models: [
    UserModel,
    DirectChatModel,
    GroupChatModel,
    ChatMembersModel,
    MessageModel,
  ],
  autoLoadModels: true,
  synchronize: true,
});
