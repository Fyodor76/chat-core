import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from 'src/chat/domain/entities/chat.entity';

export class MessageResponseDto {
  @ApiProperty({
    description: 'ID сообщения',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Текст сообщения',
    example: 'Привет! Как дела?',
  })
  content: string;

  @ApiProperty({
    description: 'ID отправителя',
    example: '9e56dde4-809e-49f8-bc19-b4c0a497b581',
  })
  senderId: string;

  @ApiProperty({
    description: 'ID чата',
    example: 'a97fb801-30b5-4a2c-a75c-9284372713c2',
  })
  chatId: string;

  @ApiProperty({
    description: 'Тип чата',
    enum: ['direct', 'group'],
    example: 'direct',
  })
  chatType: ChatType;

  @ApiProperty({
    description: 'Кто прочитал сообщение',
    type: [String],
    example: ['user-id-1', 'user-id-2'],
  })
  readBy: string[];

  @ApiProperty({
    description: 'Прочитано ли текущим пользователем',
    example: true,
  })
  isRead: boolean;

  @ApiProperty({
    description: 'Время создания',
    example: '2026-01-10T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Время обновления',
    example: '2026-01-10T19:30:00.000Z',
  })
  updatedAt: Date;
}
