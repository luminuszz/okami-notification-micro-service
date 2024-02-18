import { WebPushSubscription } from '@domain/subscriber/entities/web-push-subscription';
import { WePushSubscriptionRepository } from '@domain/subscriber/use-cases/repositories/web-push-subscription-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWebPushSubscriptionRepository implements WePushSubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async create(webPushSubscription: WebPushSubscription): Promise<void> {
    await this.prisma.webPushSubscription.create({
      data: {
        p256dh: webPushSubscription.webPushSubscriptionP256dh,
        auth: webPushSubscription.webPushSubscriptionAuth,
        createdAt: webPushSubscription.createdAt,
        id: webPushSubscription.id,
        subscriberId: webPushSubscription.subscriberId,
        endpoint: webPushSubscription.endpoint,
      },
    });
  }
}
