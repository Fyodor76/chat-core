import { WsException } from '@nestjs/websockets';
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
  throwUnauthorized,
} from './http-exception.helper';

export const throwChatNotFound = (chatId?: string) => {
  const message = chatId ? `Chat ${chatId} not found` : 'Chat not found';
  throwNotFound(message);
};

export const throwNotChatMember = (userId: string, chatId: string) => {
  throwUnauthorized(`User ${userId} is not a member of chat ${chatId}`);
};

export const throwChatAlreadyExists = (userId1: string, userId2: string) => {
  throwConflict(`Chat between ${userId1} and ${userId2} already exists`);
};

export const throwNoChatPermission = (action: string, chatId: string) => {
  throwUnauthorized(`No permission to ${action} in chat ${chatId}`);
};

export const throwDirectChatValidation = (message?: string) => {
  throwBadRequest(message || 'Direct chat validation failed');
};

export const throwGroupChatValidation = (message?: string) => {
  throwBadRequest(message || 'Group chat validation failed');
};

export const throwWsChatNotFound = (chatId?: string) => {
  const message = chatId ? `Chat ${chatId} not found` : 'Chat not found';
  throw new WsException(message);
};

export const throwWsNotChatMember = (userId: string, chatId: string) => {
  throw new WsException(`User ${userId} is not a member of chat ${chatId}`);
};

export const throwWsChatAlreadyExists = (userId1: string, userId2: string) => {
  throw new WsException(
    `Chat between ${userId1} and ${userId2} already exists`,
  );
};

export const throwWsNoChatPermission = (action: string, chatId: string) => {
  throw new WsException(`No permission to ${action} in chat ${chatId}`);
};
