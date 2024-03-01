import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { ResourceNotFound } from './errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from './repositories/subscriber-repository';
import { MailProvider } from './providers/mail-provider';

interface SendAuthCodeEmailRequest {
  email: string;
}

type SendAuthCodeEmailResponse = Either<ResourceNotFound, null>;

@Injectable()
export class SendAuthCodeEmail implements UseCaseImplementation<SendAuthCodeEmailRequest, SendAuthCodeEmailResponse> {
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly mailProvider: MailProvider,
  ) {}

  async execute({ email }: SendAuthCodeEmailRequest): Promise<SendAuthCodeEmailResponse> {
    const existsSubscriber = await this.subscriberRepository.findByEmail(email);

    if (!existsSubscriber) return left(new ResourceNotFound('Subscriber not found'));

    const sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    existsSubscriber.authCode = String(sixDigitCode);

    await this.subscriberRepository.save(existsSubscriber);

    await this.mailProvider.sendMail({
      to: existsSubscriber.email,
      subject: 'Okami Platform',
      body: `Seu código de autorização é: ${sixDigitCode}`,
    });

    return right(null);
  }
}
