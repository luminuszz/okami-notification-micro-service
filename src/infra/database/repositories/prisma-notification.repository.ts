import { NotificationRepository } from '@domain/notification/notification.repository';
import { PrismaService } from '../prisma.service';
import { Notification } from '@domain/notification/notifications';
import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@core/domain-events/domain-events';
import { map } from 'lodash';
import { Notification as PrismaNotification } from '@prisma/client';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private parseToEntity(prismaNotification: PrismaNotification): Notification {
    return Notification.create({
      content: prismaNotification.content,
      createdAt: prismaNotification.createdAt,
      subscriberId: prismaNotification.subscriberId,
      channels: prismaNotification.channels as any,
      providers: prismaNotification.providers as any,
      readAt: prismaNotification.readAt,
    });
  }

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        content: notification.content,
        id: notification.id,
        readAt: notification.readAt,
        subscriberId: notification.subscriberId,
        createdAt: notification.createdAt,
        channels: notification.channels,
        providers: notification.providers,
      },
    });

    DomainEvents.dispatchAggregateEvents(notification.toUniqueEntityID());
  }

  async fetchRecentSubscriberNotifications(subscriberId: string): Promise<Notification[]> {
    const results = await this.prisma.notification.findMany({
      where: {
        subscriberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return map(results, this.parseToEntity);
  }
}
