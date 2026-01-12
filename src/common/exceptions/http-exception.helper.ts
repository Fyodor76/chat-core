import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export const throwNotFound = (message = 'Resource not found') => {
  throw new NotFoundException({ status: 404, message });
};

export const throwBadRequest = (message = 'Invalid request') => {
  throw new BadRequestException({ status: 400, message });
};

export const throwUnauthorized = (message = 'Unauthorized') => {
  throw new UnauthorizedException({ status: 401, message });
};

export const throwInternal = (
  error?: unknown,
  safeMessage = 'Something went wrong',
) => {
  if (error instanceof Error) {
    Logger.error('[Internal Error]', error.stack || error.message);

    if (process.env.NODE_ENV !== 'production') {
      throw new InternalServerErrorException({
        status: 500,
        message: error.message,
      });
    }

    throw new InternalServerErrorException({
      status: 500,
      message: safeMessage,
      error: error.message,
    });
  }

  Logger.error('[Internal Error]', error);
  throw new InternalServerErrorException({
    status: 500,
    message: safeMessage,
  });
};

export const throwInternalWs = (
  error?: unknown,
  safeMessage = 'Something went wrong',
): never => {
  console.log(error, 'ERROR BLAT');
  const isError = error instanceof Error;

  const detailedMessage =
    process.env.NODE_ENV !== 'production' && isError
      ? error.message
      : safeMessage;

  Logger.error('[Internal WS Error]', isError ? error.stack : String(error));

  throw new WsException(detailedMessage);
};

export const throwConflict = (message = 'Conflict error') => {
  throw new ConflictException({ status: 409, message });
};
