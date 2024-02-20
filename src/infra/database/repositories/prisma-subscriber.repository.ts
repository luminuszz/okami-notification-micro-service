import { Subscriber } from '@domain/subscriber/entities/subscriber';
import { SubscriberRepository } from '@domain/subscriber/use-cases/repositories/subscriber-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Subscriber as PrismaSubscriber,
  WebPushSubscription as PrismaWebPushSubscription,
  MobileSubscription as PrismaMobileSubscription,
} from '@prisma/client';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { map } from 'lodash';
import { WebPushSubscription } from '@domain/subscriber/entities/web-push-subscription';
import { MobilePushSubscription } from '@domain/subscriber/entities/mobile-push-subscription';

interface PrismaSubscriberWithRelations extends PrismaSubscriber {
  webPushSubscriptions?: PrismaWebPushSubscription[];
  mobileSubscriptions?: PrismaMobileSubscription[];
}

@Injectable()
export class PrismaSubscriberRepository implements SubscriberRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(subscriber: PrismaSubscriberWithRelations): Subscriber {
    return Subscriber.create(
      {
        recipientId: subscriber.recipientId,
        telegramChatId: subscriber.telegramId || '',
        createdAt: subscriber.createdAt,
        mobilePushSubscriptions: map(subscriber.mobileSubscriptions, (content) =>
          MobilePushSubscription.create(
            {
              createdAt: content.createdAt,
              subscriberId: content.subscriberId,
              subscriptionToken: content.subscriptionToken,
            },
            new UniqueEntityID(content.id),
          ),
        ),
        webPushSubscriptions: map(subscriber.webPushSubscriptions, (content) =>
          WebPushSubscription.create(
            {
              createdAt: content.createdAt,
              endpoint: content.endpoint,
              subscriberId: content.subscriberId,
              webPushSubscriptionAuth: content.auth,
              webPushSubscriptionP256dh: content.p256dh,
            },
            new UniqueEntityID(content.id),
          ),
        ),
      },

      new UniqueEntityID(subscriber.id),
    );
  }

  async create(subscriber: Subscriber): Promise<void> {
    await this.prisma.subscriber.create({
      data: {
        id: subscriber.id,
        recipientId: subscriber.recipientId,
        telegramId: subscriber.telegramChatId,
      },
    });
  }
  async findById(subscriberId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        id: subscriberId,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async save(subscriber: Subscriber): Promise<void> {
    await this.prisma.subscriber.update({
      where: {
        id: subscriber.id,
      },
      data: {
        telegramId: subscriber.telegramChatId,
      },
    });
  }

  async getSubscriptions(subscriberId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        id: subscriberId,
      },
      include: {
        mobileSubscriptions: true,
        webPushSubscriptions: true,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async findByRecipientId(recipientId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        recipientId,
      },
    });

    return results ? this.toEntity(results) : null;
  }
}
