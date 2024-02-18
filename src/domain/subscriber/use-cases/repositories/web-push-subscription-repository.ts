import { WebPushSubscription } from '@domain/subscriber/entities/web-push-subscription';

export abstract class WePushSubscriptionRepository {
  abstract create(webPushSubscription: WebPushSubscription): Promise<void>;
}
