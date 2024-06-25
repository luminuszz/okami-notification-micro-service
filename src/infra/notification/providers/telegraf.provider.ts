import { EnvService } from '@app/infra/env/env.service';
import { CompareSubscriberAuthCode } from '@domain/subscriber/use-cases/compare-subscriber-auth-code';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { SendAuthCodeEmail } from '@domain/subscriber/use-cases/send-auth-code-mail';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { z } from 'zod';

const payloadEmailSchema = z
  .string({ invalid_type_error: 'Valor inválido', required_error: 'Informe o email' })
  .email('Informe um e-mail válido');

type UserMetadata = {
  email: string;
  chatId: string;
  emailSanded: boolean;
};

const payloadAthCodeSchema = z.string().min(6, 'Código inválido').max(6, 'Código inválido');

@Injectable()
export class TelegrafProvider implements OnModuleDestroy {
  public bot: Telegraf;

  private memoryUsers = new Map<string, UserMetadata>();

  constructor(
    private readonly env: EnvService,
    private readonly updateTelegramChatId: UpdateSubscriberTelegramChatId,
    private readonly sendAuthCodeEmail: SendAuthCodeEmail,
    private readonly compareAuthCode: CompareSubscriberAuthCode,
    private readonly findSubscriberByEmail: FindSubscriberByEmail,
  ) {
    this.bot = new Telegraf(this.env.get('TELEGRAM_NOTIFICATION_BOT'));

    void this.startBotProcess();
  }

  onModuleDestroy() {
    if (this.bot) {
      this.bot.stop('SIGTERM');
    }
  }

  private async startBotProcess() {
    this.bot.start((ctx) => {
      ctx.reply('Bem vindo ao Okami Bot Notifier');
      ctx.reply('Para receber notificações das suas obras favoritas, use o comando /vincularchat');
    });

    this.runVincularChatCommand();
    this.runConfirmarChatCommand();

    this.handleReceivedMessage();

    await this.bot.launch();
  }

  private handleReceivedMessage() {
    this.bot.on(message('text'), async (ctx) => {
      const isValidEmail = payloadEmailSchema.safeParse(ctx.message.text);

      if (isValidEmail.success) {
        const email = isValidEmail.data;

        await this.sendAuthCodeEmail.execute({ email });

        this.memoryUsers.set(String(ctx.chat.id), { email, chatId: String(ctx.chat.id), emailSanded: true });

        await ctx.reply(
          `Se **${email}** corresponder aos dados enviaremos um e-mail 
          com o código de acesso  use /confirmarchat e informe o código que você recebeu por e-mail
        
          /confirmarchat
          `,
          {
            reply_to_message_id: ctx.message.message_id,
          },
        );

        return;
      }

      const isValidAuthCode = payloadAthCodeSchema.safeParse(ctx.message.text);

      if (isValidAuthCode.success) {
        const currentUserEmail = this.memoryUsers.get(String(ctx.chat.id))?.email ?? '';

        const results = await this.findSubscriberByEmail.execute({ email: currentUserEmail });

        if (results.isLeft()) {
          await ctx.reply('Email não encontrado');
          return;
        }

        const { subscriber } = results.value;

        const compareResult = await this.compareAuthCode.execute({
          authCode: isValidAuthCode.data,
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

        this.memoryUsers.delete(String(ctx.chat.id));

        return;
      }
    });
  }

  private runVincularChatCommand() {
    this.bot.command('vincularchat', async (ctx) => {
      await ctx.reply('Informe seu email na plataforma Okami');
    });
  }

  private runConfirmarChatCommand() {
    this.bot.command('confirmarchat', async (ctx) => {
      await ctx.reply('Informe o código que você recebeu por e-mail');
    });
  }
}
