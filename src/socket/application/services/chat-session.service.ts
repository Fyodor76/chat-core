import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ChatSessionService {
  private readonly SOCKET_PREFIX = 'socket:';
  private readonly USER_SESSIONS_PREFIX = 'user_sessions:';
  private readonly CHAT_SESSIONS_PREFIX = 'chat_sessions:';
  private readonly USER_CHATS_PREFIX = 'user_chats:';
  private readonly CHAT_MEMBERS_PREFIX = 'chat:members:';
  private readonly SESSION_TTL = 24 * 60 * 60;

  constructor(private readonly redisService: RedisService) {}

  async getSocketIdByUserId(userId: string): Promise<string | null> {
    return await this.redisService.get(`${this.USER_SESSIONS_PREFIX}${userId}`);
  }

  async clearUserSessions(userId: string): Promise<void> {
    const socketPattern = `${this.USER_SESSIONS_PREFIX}${userId}:*`;
    const socketKeys = await this.redisService.keys(socketPattern);

    for (const key of socketKeys) {
      const socketId = key.split(':')[2];
      await this.redisService.del(`${this.SOCKET_PREFIX}${socketId}`);
      await this.redisService.del(key);
    }
  }

  async saveChatSession(chatId: string, socketIds: string[]): Promise<void> {
    const key = `${this.CHAT_SESSIONS_PREFIX}:${chatId}`;
    if (socketIds.length > 0) {
      await this.redisService.sadd(key, this.SESSION_TTL, ...socketIds);
    }
  }

  async getSocketsByChatId(chatId: string): Promise<string[]> {
    return await this.redisService.smembers(
      `${this.CHAT_SESSIONS_PREFIX}:${chatId}`,
    );
  }

  async removeSocketFromChat(chatId: string, socketId: string): Promise<void> {
    const key = `${this.CHAT_SESSIONS_PREFIX}:${chatId}`;
    await this.redisService.srem(key, socketId);

    const members = await this.redisService.smembers(key);
    if (members.length === 0) {
      await this.redisService.del(key);
    }
  }

  async addUserToChat(userId: string, chatId: string): Promise<void> {
    const key = `${this.USER_CHATS_PREFIX}${userId}`;
    await this.redisService.sadd(key, this.SESSION_TTL, chatId);
  }

  async removeUserFromChat(userId: string, chatId: string): Promise<void> {
    const key = `${this.USER_CHATS_PREFIX}${userId}`;
    await this.redisService.srem(key, chatId);
  }

  async getUserChats(userId: string): Promise<string[]> {
    const key = `${this.USER_CHATS_PREFIX}${userId}`;
    return await this.redisService.smembers(key);
  }

  async removeUserFromAllChats(userId: string): Promise<void> {
    const key = `${this.USER_CHATS_PREFIX}${userId}`;
    await this.redisService.del(key);
  }

  async addChatMember(chatId: string, userId: string): Promise<void> {
    const key = `${this.CHAT_MEMBERS_PREFIX}${chatId}`;
    await this.redisService.sadd(key, this.SESSION_TTL, userId);
  }

  async removeChatMember(chatId: string, userId: string): Promise<void> {
    const key = `${this.CHAT_MEMBERS_PREFIX}${chatId}`;
    await this.redisService.srem(key, userId);
  }

  async getChatMembers(chatId: string): Promise<string[]> {
    const key = `${this.CHAT_MEMBERS_PREFIX}${chatId}`;
    return await this.redisService.smembers(key);
  }

  async cacheChatMembers(chatId: string, userIds: string[]): Promise<void> {
    const key = `${this.CHAT_MEMBERS_PREFIX}${chatId}`;
    if (userIds.length > 0) {
      await this.redisService.sadd(key, this.SESSION_TTL, ...userIds);
    }
  }
}
