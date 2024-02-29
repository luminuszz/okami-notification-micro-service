export class NewSubscriberDto {
  recipientId: string;
  email: string;

  telegramChatId?: string;
  webPushSubscriptionAuth?: string;
  webPushSubscriptionP256dh?: string;
  mobilePushToken?: string;
}
