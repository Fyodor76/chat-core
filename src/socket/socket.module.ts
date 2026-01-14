import { Module } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';
import { ChatSessionService } from './application/services/chat-session.service';
import { RedisModule } from 'src/redis/redis.module';
import { TokenModule } from 'src/common/tokens/token.module';
import { MessageModule } from 'src/messages/message.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [RedisModule, TokenModule, ChatModule, MessageModule],
  providers: [ChatGateway, ChatSessionService],
  exports: [ChatGateway, ChatSessionService],
})
export class SocketModule {}
