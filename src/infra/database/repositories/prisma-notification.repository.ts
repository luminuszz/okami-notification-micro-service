import { NotificationRepository } from '@domain/notification/notification.repository';
import { PrismaService } from '../prisma.service';
import { Notification } from '@domain/notification/notifications';
import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@core/domain-events/domain-events';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        content: notification.content,
        id: notification.id,
        readAt: notification.readAt,
        recipientId: notification.recipientId,
      },
    });

    DomainEvents.dispatchAggregateEvents(notification.toUniqueEntityID());
  }
}
