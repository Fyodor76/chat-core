import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from 'src/common/filters/all-ws-exceptions.filter';
import { TokenService } from 'src/common/tokens/token.service';
import { ChatApplication } from 'src/chat/application/chat.service';
import { CreateGroupChatDto } from 'src/chat/application/dto/create-group-chat.dto';
import { CreateMessageDto } from 'src/messages/application/dto/create-message.dto';
import { CreateDirectChatDto } from 'src/chat/application/dto/create-direct-chat.dto';
import { MessageApplication } from 'src/messages/application/message.service';
import { ChatSessionService } from './application/services/chat-session.service';
import { CHAT_TYPE, ChatType } from 'src/chat/domain/entities/chat.entity';

@UseFilters(AllWsExceptionsFilter)
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  port: 8080,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatApplicationService: ChatApplication,
    private readonly messageApplicationService: MessageApplication,
    private readonly chatSessionService: ChatSessionService,
    private readonly tokenService: TokenService,
  ) {}

  afterInit(server: Server): void {
    this.server = server;
    console.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    const payload = this.tokenService.validateWsToken(client.handshake);
    const userId = payload.sub;

    client.data.userId = userId;

    client.join(`user:${userId}`);

    console.log(`User ${userId} connected`);

    client.emit('connected', {
      success: true,
      userId,
      socketId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('group-chat:create')
  async handleCreateGroupChat(@MessageBody() data: CreateGroupChatDto) {
    const chat = await this.chatApplicationService.createGroupChat(data);

    for (const member of chat.members) {
      const userId = member.user.id;
      await this.chatSessionService.addUserToChat(userId, chat.id);
      await this.chatSessionService.addChatMember(chat.id, userId);
    }

    for (const member of chat.members) {
      this.server.to(`user:${member.user.id}`).emit('chat:created', {
        type: 'chat_created',
        chat,
        isNew: true,
      });
    }

    return { success: true, chat };
  }

  @SubscribeMessage('direct-chat:create')
  async handleCreateDirectChat(@MessageBody() data: CreateDirectChatDto) {
    const chat = await this.chatApplicationService.createDirectChat(data);

    for (const member of chat.members) {
      const userId = member.user.id;
      await this.chatSessionService.addUserToChat(userId, chat.id);
      await this.chatSessionService.addChatMember(chat.id, userId);
    }

    for (const member of chat.members) {
      this.server.to(`user:${member.user.id}`).emit('chat:created', {
        type: 'chat_created',
        chat,
        isNew: true,
      });
    }

    return { success: true, chat };
  }

  @SubscribeMessage('message:create')
  async handleCreateMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageApplicationService.createMessage(data);

    let userIds = await this.chatSessionService.getChatMembers(data.chatId);

    if (userIds.length === 0) {
      const chat = await this.getChatWithMembers(
        message.chatId,
        message.chatType,
      );
      userIds = chat.members.map((m) => m.user.id);

      await this.chatSessionService.cacheChatMembers(data.chatId, userIds);

      for (const userId of userIds) {
        await this.chatSessionService.addUserToChat(userId, data.chatId);
      }
    }

    const otherUserIds = userIds.filter((id) => id !== data.senderId);

    const notificationData = {
      type: 'message_created',
      chatId: data.chatId,
      message,
      chatPreview: {
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
      },
    };

    otherUserIds.forEach((userId) => {
      this.server
        .to(`user:${userId}`)
        .emit('message:created', notificationData);
    });

    client.emit('message:sent', {
      type: 'message_sent',
      chatId: data.chatId,
      message: notificationData.message,
      status: 'delivered',
      deliveredTo: otherUserIds.length,
      chatPreview: {
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
        unreadCount: 0,
      },
    });

    return {
      success: true,
      message: notificationData.message,
      deliveredTo: otherUserIds.length,
    };
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.data.userId;

    if (userId) {
      console.log(`User ${userId} disconnected (socket: ${client.id})`);
    } else {
      console.log(`Client disconnected: ${client.id}`);
    }
  }

  private async getChatWithMembers(chatId: string, chatType: ChatType) {
    if (chatType === CHAT_TYPE.DIRECT) {
      return await this.chatApplicationService.getDirectChatById(chatId);
    } else {
      return await this.chatApplicationService.getGroupChatById(chatId);
    }
  }
}
