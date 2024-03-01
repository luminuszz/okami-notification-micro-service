import { MailProvider, SendEmailDto } from '@domain/subscriber/use-cases/providers/mail-provider';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { Resend } from 'resend';

@Injectable()
export class ResendEmailProviderService implements MailProvider {
  private resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(env.get('RESEND_API_SECRET_KEY'));
  }

  async sendMail({ body, subject, to }: SendEmailDto): Promise<void> {
    const { error } = await this.resend.emails.send({
      to: to,
      subject: subject,
      text: body,
      from: 'Okami Platform <okami@okami-mail.daviribeiro.com>',
    });

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `);
    }
  }
}
