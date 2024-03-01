import { MailProvider } from '@domain/subscriber/use-cases/providers/mail-provider';
import { Module } from '@nestjs/common';
import { ResendEmailProviderService } from './resend-provider.service';

@Module({
  providers: [
    {
      provide: MailProvider,
      useClass: ResendEmailProviderService,
    },
  ],

  exports: [MailProvider],
})
export class MailModule {}
