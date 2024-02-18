import { MobilePushSubscription } from '@domain/subscriber/entities/mobile-push-subscription';
import { MobilePushSubscriptionRepository } from '@domain/subscriber/use-cases/repositories/mobile-push-subscription-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMobilePushSubscriptionRepository implements MobilePushSubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(mobilePushSubscription: MobilePushSubscription): Promise<void> {
    await this.prismaService.mobileSubscription.create({
      data: {
        id: mobilePushSubscription.id,
        subscriptionToken: mobilePushSubscription.subscriptionToken,
        subscriberId: mobilePushSubscription.subscriberId,
      },
    });
  }
}
