import { EnvService } from '@app/infra/env/env.service';
import { NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Telegraf } from 'telegraf';
import { NotificationContentParsed } from './dto/notification-parsed.dto';

@Injectable()
export class TelegramNotificationHandler implements OnModuleDestroy {
  private readonly telegraf: Telegraf;

  constructor(private readonly env: EnvService) {
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

  @OnEvent('notification.created')
  public async publish({ notification, subscriber }: NotificationPublisherPayload): Promise<void> {
    const content = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.telegramChatId) return;

    const caption = this.parseContent(`${content.message.toString()}\n\n${content.url}`);

    const isAllowedImageFiletype = ['png', 'jpg', 'jpeg', 'webp'].includes(content?.imageUrl?.split('.')?.pop() ?? '');

    if (isAllowedImageFiletype) {
      this.telegraf.telegram.sendPhoto(subscriber.telegramChatId, content.imageUrl, {
        caption,
        parse_mode: 'MarkdownV2',
      });
    } else {
      this.telegraf.telegram.sendMessage(subscriber.telegramChatId, this.parseContent(content.message), {
        parse_mode: 'MarkdownV2',
      });
    }
  }
}
