import { Logger } from '@nestjs/common';
import {
  throwInternal,
  throwInternalWs,
} from '../exceptions/http-exception.helper';

export async function tryCatch<T>(
  handler: () => Promise<T>,
  context: string,
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    Logger.error(`[${context}]`, error.stack || error.message);
    throwInternal(error, 'Something went wrong');
  }
}

export async function tryCatchWs<T>(
  handler: () => Promise<T>,
  context: string,
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    Logger.error(`[${context}]`, error.stack || error.message);
    throwInternalWs(error);
  }
}
