import { EnvService } from '@app/infra/env/env.service';
import { NotificationEventEmitter } from '../notification-event-emitter';
import { Notification } from '@domain/notification/notifications';
import { Telegraf } from 'telegraf';
import { NotificationContentParsed } from './dto/notification-parsed.dto';
import { OnModuleDestroy } from '@nestjs/common';

export class TelegramNotificationHandler implements OnModuleDestroy {
  private readonly telegraf: Telegraf;

  constructor(
    private readonly notificationEventEmitter: NotificationEventEmitter,
    private readonly env: EnvService,
  ) {
    this.notificationEventEmitter.subscriberToNotification({
      name: TelegramNotificationHandler.name,
      handle: this.publish.bind(this),
    });

    this.telegraf = new Telegraf(this.env.get('TELEGRAM_NOTIFICATION_BOT'));
  }
  onModuleDestroy() {
    if (this.telegraf) {
      this.telegraf.stop('SIGTERM');
    }
  }

  private parseContent(content: string): string {
    return content
      .replaceAll('_', '\\_')
      .replaceAll('**', '\\**')
      .replaceAll('[', '\\[')
      .replaceAll(']', '\\]')
      .replaceAll('`', '\\`')
      .replaceAll('-', '\\-')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
      .replaceAll('.', '\\.')
      .replaceAll('!', '\\!')
      .replaceAll('>', '\\>')
      .replaceAll('<', '\\<');
  }

  public async publish(notification: Notification): Promise<void> {
    const { content, subscriber } = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.telegramChatId) return;

    if (content.imageUrl) {
      this.telegraf.telegram.sendPhoto(subscriber.telegramChatId, content.imageUrl, {
        caption: this.parseContent(content.message),
        parse_mode: 'MarkdownV2',
      });
    } else {
      this.telegraf.telegram.sendMessage(subscriber.telegramChatId, this.parseContent(content.message), {
        parse_mode: 'MarkdownV2',
      });
    }
  }
}
