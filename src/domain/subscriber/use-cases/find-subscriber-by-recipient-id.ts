import { UseCaseImplementation } from '@core/use-case';
import { Subscriber } from '../entities/subscriber';
import { ResourceNotFound } from './errors/resource-not-found';
import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from './repositories/subscriber-repository';

interface FindSubscriberByIdRequest {
  recipientId: string;
}

type FindSubscriberByIdResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class FindSubscriberByRecipientId
  implements UseCaseImplementation<FindSubscriberByIdRequest, FindSubscriberByIdResponse>
{
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute({ recipientId }: FindSubscriberByIdRequest): Promise<FindSubscriberByIdResponse> {
    const subscriber = await this.subscriberRepository.findByRecipientId(recipientId);

    if (!subscriber) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    return right({
      subscriber,
    });
  }
}
