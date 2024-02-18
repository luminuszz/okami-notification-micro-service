export class NewSubscriberDto {
  recipientId: string;

  telegramChatId?: string;
  webPushSubscriptionAuth?: string;
  webPushSubscriptionP256dh?: string;
  mobilePushToken?: string;
}
