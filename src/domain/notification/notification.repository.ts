import { Notification } from './notifications';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
}
