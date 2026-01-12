import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { WsExceptionFilter } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AllWsExceptionsFilter } from './all-ws-exceptions.filter';

@Catch()
export class UniversalExceptionsFilter
  implements ExceptionFilter, WsExceptionFilter
{
  private readonly httpFilter = new AllExceptionsFilter();
  private readonly wsFilter = new AllWsExceptionsFilter();

  catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType();

    if (type === 'http') {
      this.httpFilter.catch(exception, host);
    } else if (type === 'ws') {
      this.wsFilter.catch(exception, host);
    } else {
      console.warn(`Unhandled context type: ${type}`, exception);
    }
  }
}
