import {
  Catch,
  WsExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter {
  private readonly logger = new Logger(AllWsExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    let message: any = 'Internal WebSocket error';
    if (exception instanceof WsException) {
      message = exception.getError();
    }

    const errorMsg =
      exception instanceof Error
        ? exception.message
        : JSON.stringify(exception);

    this.logger.error(
      `WS Error: ${errorMsg}`,
      exception instanceof Error ? exception.stack : '',
    );

    client.emit('error', { message });
  }
}
