import { EnvService } from '@app/infra/env/env.service';
import { CompareSubscriberAuthCode } from '@domain/subscriber/use-cases/compare-subscriber-auth-code';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { SendAuthCodeEmail } from '@domain/subscriber/use-cases/send-auth-code-mail';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { z } from 'zod';

@Injectable()
export class TelegrafProvider implements OnModuleDestroy, OnModuleInit {
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
  }

  async onModuleInit() {
    await this.startBotProcess();
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
      ctx.reply('Para receber notificações das suas obras favoritas, use o comando /vincularchat');
    });

    this.runVincularChatCommand();
    this.runConfirmarChatCommand();

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
        
          /confirmarchat
          `,
          {
            reply_to_message_id: ctx.message.message_id,
          },
        );
      });
    });
  }

  private runConfirmarChatCommand() {
    this.instance.command('confirmarchat', async (ctx) => {
      await ctx.reply('Informe o código que você recebeu por e-mail');

      this.instance.on(message('text'), async (ctx) => {
        const authCode = z.string().length(6, 'Código inválido').safeParse(ctx.message.text);

        if (!authCode.success) {
          await ctx.reply('Código inválido');
          return;
        }

        const currentUserEmail = this.memoryUsers.get(String(ctx.chat.id))?.email ?? '';

        const results = await this.findSubscriberByEmail.execute({ email: currentUserEmail });

        if (results.isLeft()) {
          await ctx.reply('Email não encontrado');
          return;
        }

        const { subscriber } = results.value;

        const compareResult = await this.compareAuthCode.execute({
          authCode: authCode.data,
          userId: subscriber.id,
        });

        if (compareResult.isLeft() || !compareResult.value.isMatch) {
          await ctx.reply('Código inválido');
          return;
        }

        await this.updateTelegramChatId.execute({
          recipientId: subscriber.recipientId,
          telegramChatId: String(ctx.chat.id),
        });

        await ctx.reply(`Chat vinculado com sucesso! Você receberá notificações por aqui !`);
      });
    });
  }
}
