import { Subscriber } from '@domain/subscriber/entities/subscriber';
import { Notification } from './notifications';

export interface NotificationPublisherPayload {
  notification: Notification;
  subscriber: Subscriber;
}

export abstract class NotificationPublisher {
  abstract publish(payload: NotificationPublisherPayload): Promise<void>;
}
