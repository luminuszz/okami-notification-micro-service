import { Notification } from './notifications';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findById(notificationId: string): Promise<Notification | null>;
  abstract save(notification: Notification): Promise<void>;
  abstract fetchRecentSubscriberNotifications(subscriberId: string): Promise<Notification[]>;
}
