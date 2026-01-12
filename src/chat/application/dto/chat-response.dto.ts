import { ApiProperty } from '@nestjs/swagger';
import { CHAT_TYPE, ChatType } from '../../domain/entities/chat.entity';

export class ChatMemberResponseDto {
  @ApiProperty({
    description: 'ID участника в чате',
    example: 'd52dff87-9bac-46d6-b653-daabffeb910c',
  })
  id: string;

  @ApiProperty({
    description: 'Информация о пользователе',
    example: {
      id: '9e56dde4-809e-49f8-bc19-b4c0a497b581',
      login: 'test',
    },
  })
  user: {
    id: string;
    login: string;
  };
}

export abstract class BaseChatResponseDto {
  @ApiProperty({
    description: 'ID чата',
    example: 'a97fb801-30b5-4a2c-a75c-9284372713c2',
  })
  id: string;

  @ApiProperty({
    description: 'Тип чата',
    enum: CHAT_TYPE,
    example: CHAT_TYPE.DIRECT,
  })
  type: ChatType;

  @ApiProperty({
    description: 'Участники чата',
    type: [ChatMemberResponseDto],
  })
  members: ChatMemberResponseDto[];

  @ApiProperty({
    description: 'Время создания',
    example: '2026-01-10T17:56:56.379Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Время обновления',
    example: '2026-01-10T17:56:56.382Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Количество непрочитанных сообщений',
    example: 0,
    required: false,
  })
  unreadCount?: number;
}

export class DirectChatResponseDto extends BaseChatResponseDto {
  @ApiProperty({
    description: 'Тип чата',
    enum: CHAT_TYPE,
    example: CHAT_TYPE.DIRECT,
  })
  type: typeof CHAT_TYPE.DIRECT;
}

export class GroupChatResponseDto extends BaseChatResponseDto {
  @ApiProperty({
    description: 'Тип чата',
    enum: CHAT_TYPE,
    example: CHAT_TYPE.GROUP,
  })
  type: typeof CHAT_TYPE.GROUP;

  @ApiProperty({
    description: 'Название группового чата',
    example: 'Рабочая группа',
  })
  name: string;

  @ApiProperty({
    description: 'ID создателя чата',
    example: '9e56dde4-809e-49f8-bc19-b4c0a497b581',
  })
  creatorId: string;

  @ApiProperty({
    description: 'Аватар чата (URL или путь к файлу)',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}
