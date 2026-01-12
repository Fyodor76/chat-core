import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(to: string, name: string, confirmLink: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Подтверждение регистрации на QuizzerHub',
      template: 'confirmation',
      context: {
        name,
        confirmLink,
      },
    });
  }
}
