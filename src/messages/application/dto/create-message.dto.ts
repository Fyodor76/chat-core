import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CHAT_TYPE, ChatType } from 'src/chat/domain/entities/chat.entity';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Текст сообщения',
    example: 'Привет! Как дела?',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @ApiProperty({
    description: 'ID отправителя',
    example: '9e56dde4-809e-49f8-bc19-b4c0a497b581',
  })
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({
    description: 'ID чата',
    example: 'a97fb801-30b5-4a2c-a75c-9284372713c2',
  })
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({
    description: 'Тип чата',
    enum: [...Object.values(CHAT_TYPE)],
    example: 'direct',
  })
  @IsEnum([...Object.values(CHAT_TYPE)])
  chatType: ChatType;

  constructor(data: {
    content: string;
    senderId: string;
    chatId: string;
    chatType: ChatType;
  }) {
    this.content = data.content;
    this.senderId = data.senderId;
    this.chatId = data.chatId;
    this.chatType = data.chatType;
  }
}
