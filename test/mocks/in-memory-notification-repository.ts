import { NotificationRepository } from '@domain/notification/contracts/notification.repository';
import { Notification } from '@domain/notification/entities/notifications';

export class InMemoryNotificationRepository implements NotificationRepository {
  public notifications: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }
}
