import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { UpdateSubscriber } from '@domain/subscriber/use-cases/update-subscriber';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';
import { FindSubscriberByRecipientId } from '@domain/subscriber/use-cases/find-subscriber-by-recipient-id';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { SendAuthCodeEmail } from '@domain/subscriber/use-cases/send-auth-code-mail';
import { MailModule } from '../mail/mail.module';
import { UpdateSubscriberEmailByRecipientId } from '@domain/subscriber/use-cases/update-subscriber-email-by-recipient-id';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
    DeleteWebPushSubscription,
    FindSubscriberByRecipientId,
    UpdateSubscriberTelegramChatId,
    FindSubscriberByEmail,
    SendAuthCodeEmail,
    UpdateSubscriberEmailByRecipientId,
  ],
  exports: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
    DeleteWebPushSubscription,
    FindSubscriberByRecipientId,
    UpdateSubscriberTelegramChatId,
    FindSubscriberByEmail,
    SendAuthCodeEmail,
    UpdateSubscriberEmailByRecipientId,
  ],
})
export class SubscriberModule {}
