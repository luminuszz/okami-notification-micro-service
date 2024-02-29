import { NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelegrafProvider } from '../providers/telegraf.provider';
import { NotificationContentParsed } from './dto/notification-parsed.dto';
import { EventCreators } from './utils';

@Injectable()
export class TelegramNotificationHandler {
  constructor(private readonly telegrafProvider: TelegrafProvider) {}

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

  @OnEvent(EventCreators.telegram('on-new-chapter'))
  public async publish({ notification, subscriber }: NotificationPublisherPayload): Promise<void> {
    const content = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.telegramChatId) return;

    const caption = this.parseContent(`${content.message.toString()}\n\n${content.url}`);

    const isAllowedImageFiletype = ['png', 'jpg', 'jpeg', 'webp'].includes(content?.imageUrl?.split('.')?.pop() ?? '');

    if (isAllowedImageFiletype) {
      this.telegrafProvider.instance.telegram.sendPhoto(subscriber.telegramChatId, content.imageUrl, {
        caption,
        parse_mode: 'MarkdownV2',
      });
    } else {
      this.telegrafProvider.instance.telegram.sendMessage(
        subscriber.telegramChatId,
        this.parseContent(content.message),
        {
          parse_mode: 'MarkdownV2',
        },
      );
    }
  }
}
