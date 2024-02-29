import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { SubscriberRepository } from './repositories/subscriber-repository';
import { ResourceNotFound } from './errors/resource-not-found';
import { Subscriber } from '../entities/subscriber';
import { Injectable } from '@nestjs/common';

interface FindSubscriberByEmailRequest {
  email: string;
}

type FindSubscriberByEmailResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class FindSubscriberByEmail
  implements UseCaseImplementation<FindSubscriberByEmailRequest, FindSubscriberByEmailResponse>
{
  constructor(private readonly subscriberRepo: SubscriberRepository) {}

  async execute({ email }: FindSubscriberByEmailRequest): Promise<FindSubscriberByEmailResponse> {
    const subscriberOrNull = await this.subscriberRepo.findByEmail(email);

    if (!subscriberOrNull) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    return right({ subscriber: subscriberOrNull });
  }
}
