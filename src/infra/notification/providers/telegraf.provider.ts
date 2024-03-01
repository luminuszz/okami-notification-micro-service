import { EnvService } from '@app/infra/env/env.service';
import { CompareSubscriberAuthCode } from '@domain/subscriber/use-cases/compare-subscriber-auth-code';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { SendAuthCodeEmail } from '@domain/subscriber/use-cases/send-auth-code-mail';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { z } from 'zod';

@Injectable()
export class TelegrafProvider implements OnModuleDestroy {
  public instance: Telegraf;

  private memoryUsers = new Map<string, { email: string }>();

  constructor(
    private readonly env: EnvService,
    private readonly updateTelegramChatId: UpdateSubscriberTelegramChatId,
    private readonly sendAuthCodeEmail: SendAuthCodeEmail,
    private readonly compareAuthCode: CompareSubscriberAuthCode,
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

    this.runVincularChatCommand();

    await this.instance.launch();
  }

  private runVincularChatCommand() {
    this.instance.command('vincularchat', async (ctx) => {
      ctx.reply('Informe seu email na plataforma Okami');

      this.instance.on(message('text'), async (ctx) => {
        const email = z.string().email().safeParse(ctx.message.text);

        if (!email.success) {
          ctx.reply('Email inválido');
          return;
        }

        await this.sendAuthCodeEmail.execute({ email: email.data });

        this.memoryUsers.set(String(ctx.chat.id), { email: email.data });

        await ctx.reply(
          `Se **${email.data}** corresponder aos dados enviaremos um e-mail 
          com o código de acesso  use /confirmarchat e informe o código que você recebeu por e-mail
        
          /confirmarchat {seu codigo}
          `,
          {
            reply_to_message_id: ctx.message.message_id,
          },
        );
      });
    });

    this.instance.command('confirmarchat', async (ctx) => {
      const authCode = z
        .string()
        .transform((value) => value.replaceAll('/confirmarchat', '').trim())
        .safeParse(ctx.message.text);

      if (!authCode.success) {
        ctx.reply('Código inválido');
        return;
      }

      const currentUserEmail = this.memoryUsers.get(String(ctx.chat.id))?.email ?? '';

      const results = await this.findSubscriberByEmail.execute({ email: currentUserEmail });

      if (results.isLeft()) {
        ctx.reply('Email não encontrado');
        return;
      }

      const { subscriber } = results.value;

      const compareResult = await this.compareAuthCode.execute({
        authCode: authCode.data,
        userId: subscriber.id,
      });

      if (compareResult.isLeft() || !compareResult.value.isMatch) {
        ctx.reply('Código inválido');
        return;
      }

      await this.updateTelegramChatId.execute({
        recipientId: subscriber.recipientId,
        telegramChatId: String(ctx.chat.id),
      });

      await ctx.reply(`Chat vinculado com sucesso! Você receberá notificações por aqui !`);
    });
  }
}
