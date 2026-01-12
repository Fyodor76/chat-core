import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const createMailerConfig = (config: ConfigService): MailerOptions => {
  const user = config.get<string>('MAIL_USER');
  const password = config.get<string>('MAIL_PASSWORD');

  return {
    transport: {
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user,
        pass: password,
      },
    },
    defaults: {
      from: `"QuizzerHub" <${user}>`,
    },
    template: {
      dir: join(__dirname, '..', 'mailer', 'templates'),
      adapter: new HandlebarsAdapter(undefined, {
        inlineCssEnabled: false,
      }),
      options: {
        strict: true,
      },
    },
  };
};
