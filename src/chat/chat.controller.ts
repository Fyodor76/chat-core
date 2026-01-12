import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatApplication } from './application/chat.service';
import { CreateDirectChatDto } from './application/dto/create-direct-chat.dto';
import { ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import {
  ChatMemberResponseDto,
  DirectChatResponseDto,
  GroupChatResponseDto,
} from './application/dto/chat-response.dto';
import { CreateGroupChatDto } from './application/dto/create-group-chat.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatApplication: ChatApplication) {}

  @Post('direct')
  async createDirectChat(
    @Body() createDirectChatDto: CreateDirectChatDto,
  ): Promise<BaseResponseDto<DirectChatResponseDto>> {
    const chat =
      await this.chatApplication.createDirectChat(createDirectChatDto);
    return new BaseResponseDto(chat);
  }

  @Post('group')
  async createGroupChat(
    @Body() createDirectChatDto: CreateGroupChatDto,
  ): Promise<BaseResponseDto<GroupChatResponseDto>> {
    const chat =
      await this.chatApplication.createGroupChat(createDirectChatDto);
    return new BaseResponseDto(chat);
  }

  @Get('direct/:id')
  async getDirectChatById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<DirectChatResponseDto>> {
    const chat = await this.chatApplication.getDirectChatById(id);
    return new BaseResponseDto(chat);
  }

  @Get('group/:id')
  async getGroupChatById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<GroupChatResponseDto>> {
    const chat = await this.chatApplication.getGroupChatById(id);
    return new BaseResponseDto(chat);
  }

  @Post('group/:chatId/members')
  async addMembersToGroupChat(
    @Param('chatId') chatId: string,
    @Body('memberIds') memberIds: string[],
  ): Promise<BaseResponseDto<ChatMemberResponseDto[]>> {
    const members = await this.chatApplication.addMembersToGroupChat(
      memberIds,
      chatId,
    );
    return new BaseResponseDto(members);
  }
}
