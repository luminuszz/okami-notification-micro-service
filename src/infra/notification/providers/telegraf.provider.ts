import { EnvService } from '@app/infra/env/env.service';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { z } from 'zod';

@Injectable()
export class TelegrafProvider implements OnModuleDestroy {
  public instance: Telegraf;

  constructor(
    private readonly env: EnvService,
    private readonly updateTelegramChatId: UpdateSubscriberTelegramChatId,
    private readonly findSubscriberByEmail: FindSubscriberByEmail,
  ) {
    this.instance = new Telegraf(this.env.get('TELEGRAM_NOTIFICATION_BOT'));

    this.startBotProcess();
  }
  onModuleDestroy() {
    if (this.instance) {
      this.instance.stop('SIGTERM');
    }
  }

  private async startBotProcess() {
    this.instance.start((ctx) => {
      console.log('started:', ctx.from);
      ctx.reply('Bem vindo ao Okami Bot Notifier');
    });

    this.instance.command('vincularchat', async (ctx) => {
      ctx.reply('Informe seu email na plataforma Okami');

      this.instance.on('text', async (ctx) => {
        const email = z.string().safeParse(ctx.message.text);

        if (!email.success) {
          ctx.reply('Email inválido');
          return;
        }

        const response = await this.findSubscriberByEmail.execute({ email: email.data });

        if (response.isLeft()) {
          ctx.reply('Email não encontrado');
          return;
        }

        const { subscriber } = response.value;

        await this.updateTelegramChatId.execute({
          recipientId: subscriber.id,
          telegramChatId: ctx.chat.id.toString(),
        });

        ctx.reply('Chat vinculado com sucesso');
      });
    });

    this.instance
      .launch()
      .then(() => console.log('Bot started'))
      .catch((err) => console.error(err));
  }
}
