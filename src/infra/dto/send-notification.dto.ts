import { ChannelsLabels, ProvidersLabels } from '@domain/notification/notifications';

export class SendNotificationDto {
  content: string;
  recipientId: string;
  channels: ChannelsLabels[];
  providers: ProvidersLabels[];
}
