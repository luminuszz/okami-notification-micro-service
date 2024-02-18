import { MobilePushSubscription } from '@domain/subscriber/entities/mobile-push-subscription';

export abstract class MobilePushSubscriptionRepository {
  abstract create(mobilePushSubscription: MobilePushSubscription): Promise<void>;
}
