import { Subscriber } from '@domain/subscriber/entities/subscriber';

export interface NotificationContentParsed {
  content: {
    name: string;
    imageUrl: string;
    chapter: number;
    message: string;
  };

  subscriber: Subscriber;
}
