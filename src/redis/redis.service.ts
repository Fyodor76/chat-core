import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { tryCatch } from 'src/common/utils/try-catch.helper';
import { throwInternal } from 'src/common/exceptions/http-exception.helper';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly logger: AppLogger,
  ) {}

  /**
   * Устанавливает значение по ключу с TTL
   * @param key Ключ
   * @param value Значение
   * @param ttl Время жизни в секундах
   * @returns true если успешно, иначе false
   */
  async set(key: string, value: string, ttl: number): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.set(key, value, 'EX', ttl);
      if (result !== 'OK') {
        this.logger.error(
          `Failed to set key "${key}". Redis response: ${result}`,
        );
        return false;
      }
      this.logger.log(`Set key "${key}" with TTL ${ttl}`);
      return true;
    }, 'RedisService:set');
  }

  /**
   * Получает значение по ключу
   * @param key Ключ
   * @returns Значение или null если нет
   */
  async get(key: string): Promise<string | null> {
    return tryCatch(async () => {
      const value = await this.redisClient.get(key);
      if (value === null) {
        this.logger.warn(`Key "${key}" not found in Redis.`);
      } else {
        this.logger.log(`Got key "${key}" from Redis.`);
      }
      return value;
    }, 'RedisService:get');
  }

  /**
   * Удаляет ключ из Redis
   * @param key Ключ
   * @returns true если ключ удален, false если ключ не найден
   */
  async del(key: string): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.del(key);
      if (result === 0) {
        this.logger.warn(`Key "${key}" not found for deletion.`);
        return false;
      }
      this.logger.log(`Deleted key "${key}" from Redis.`);
      return true;
    }, 'RedisService:del');
  }

  /**
   * Получить список ключей по паттерну
   * @param pattern Паттерн ключей, например '*'
   * @returns Массив ключей
   */
  async keys(pattern: string): Promise<string[]> {
    return tryCatch(async () => {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length === 0) {
        this.logger.warn(`No keys found matching pattern "${pattern}".`);
      } else {
        this.logger.log(
          `Found ${keys.length} keys matching pattern "${pattern}".`,
        );
      }
      return keys;
    }, 'RedisService:keys');
  }

  /**
   * Создает SHA256 хэш от переданного значения
   * @param value Строка для хэширования
   * @returns Хэш в hex-формате
   */
  hash(value: string): string {
    try {
      const hash = crypto.createHash('sha256').update(value).digest('hex');
      this.logger.debug(`Hashed value "${value}"`);
      return hash;
    } catch (error) {
      this.logger.error(
        `Error while hashing value: ${error.message}`,
        error.stack,
      );
      throwInternal(error, 'Failed to hash value.');
    }
  }

  /**
   * Добавляет элементы в Redis Set
   * @param key Ключ Set
   * @param values Элементы для добавления
   * @returns Количество добавленных элементов
   */
  async sadd(
    key: string,
    ttl?: number | string,
    ...values: string[]
  ): Promise<number> {
    return tryCatch(async () => {
      const result = await this.redisClient.sadd(key, ...values);
      this.logger.log(`Added ${result} elements to set "${key}"`);

      if (ttl !== undefined) {
        await this.redisClient.expire(key, ttl);
      }

      return result;
    }, 'RedisService:sadd');
  }

  /**
   * Удаляет элементы из Redis Set
   * @param key Ключ Set
   * @param values Элементы для удаления
   * @returns Количество удаленных элементов
   */
  async srem(key: string, ...values: string[]): Promise<number> {
    return tryCatch(async () => {
      const result = await this.redisClient.srem(key, ...values);
      this.logger.log(`Removed ${result} elements from set "${key}"`);
      return result;
    }, 'RedisService:srem');
  }

  /**
   * Получает все элементы Redis Set
   * @param key Ключ Set
   * @returns Массив элементов
   */
  async smembers(key: string): Promise<string[]> {
    return tryCatch(async () => {
      const members = await this.redisClient.smembers(key);
      if (members.length === 0) {
        this.logger.warn(`Set "${key}" is empty or not found.`);
      } else {
        this.logger.log(`Got ${members.length} members from set "${key}"`);
      }
      return members;
    }, 'RedisService:smembers');
  }

  /**
   * Проверяет существует ли элемент в Redis Set
   * @param key Ключ Set
   * @param value Значение для проверки
   * @returns true если существует
   */
  async sismember(key: string, value: string): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.sismember(key, value);
      return result === 1;
    }, 'RedisService:sismember');
  }

  /**
   * Устанавливает TTL для ключа
   * @param key Ключ
   * @param ttl Время жизни в секундах
   * @returns true если успешно, false если ключ не найден
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.expire(key, ttl);
      if (result === 0) {
        this.logger.warn(`Key "${key}" not found for setting TTL.`);
        return false;
      }
      this.logger.log(`Set TTL ${ttl} for key "${key}"`);
      return true;
    }, 'RedisService:expire');
  }
}
