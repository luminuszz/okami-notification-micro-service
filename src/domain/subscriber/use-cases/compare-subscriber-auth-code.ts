import { UseCaseImplementation } from '@core/use-case';
import { ResourceNotFound } from './errors/resource-not-found';
import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from './repositories/subscriber-repository';

interface CompareSubscriberAuthCodeRequest {
  userId: string;
  authCode: string;
}

type CompareSubscriberAuthCodeResponse = Either<ResourceNotFound, { isMatch: boolean }>;

@Injectable()
export class CompareSubscriberAuthCode
  implements UseCaseImplementation<CompareSubscriberAuthCodeRequest, CompareSubscriberAuthCodeResponse>
{
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute({ authCode, userId }: CompareSubscriberAuthCodeRequest): Promise<CompareSubscriberAuthCodeResponse> {
    const existsSubscriber = await this.subscriberRepository.findById(userId);

    if (!existsSubscriber) return left(new ResourceNotFound('Subscriber not found'));

    const isMatch = existsSubscriber.compareAuthCode(authCode);

    return right({
      isMatch,
    });
  }
}
