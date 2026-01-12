import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { MessageApplication } from './application/message.service';
import { CreateMessageDto } from './application/dto/create-message.dto';
import {
  BaseResponseDeleteDto,
  BaseResponseDto,
} from 'src/common/dto/base-response.dto';
import { MarkAsReadDto } from './application/dto/mark-as-read.dto';
import { MessageResponseDto } from './application/dto/response-message.dto';
import { GetChatMessagesQueryDto } from './application/dto/get-chat-messages-query.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageApplication: MessageApplication) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateMessageDto,
  ): Promise<BaseResponseDto<MessageResponseDto>> {
    const message = await this.messageApplication.createMessage(dto);
    return new BaseResponseDto(message);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<MessageResponseDto>> {
    const message = await this.messageApplication.getMessage(id);
    return new BaseResponseDto(message);
  }

  @Get('chat/:chatId')
  async getByChatId(
    @Param('chatId') chatId: string,
    @Query() query: GetChatMessagesQueryDto,
  ): Promise<BaseResponseDto<MessageResponseDto[]>> {
    const messages = await this.messageApplication.getChatMessages(
      chatId,
      query.limit,
    );
    return new BaseResponseDto(messages);
  }

  @Post(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() dto: MarkAsReadDto,
  ): Promise<BaseResponseDto<MessageResponseDto>> {
    const message = await this.messageApplication.markMessageAsRead(
      id,
      dto.userId,
    );
    return new BaseResponseDto(message);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResponseDeleteDto> {
    const deletedId = await this.messageApplication.deleteMessage(id);
    return new BaseResponseDeleteDto(deletedId, 'Message deleted successfully');
  }
}
