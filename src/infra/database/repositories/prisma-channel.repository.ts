import { Channel } from '@domain/subscriber/entities/channel';
import { ChannelRepository } from '@domain/subscriber/use-cases/repositories/channel-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { map } from 'lodash';
import { Channel as PrismaChannel, Subscriber as PrismaSubscriber } from '@prisma/client';
import { Subscriber } from '@domain/subscriber/entities/subscriber';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface PrismaChannelWithSubscribers extends PrismaChannel {
  subscribers: PrismaSubscriber[];
}

@Injectable()
export class PrismaChannelRepository implements ChannelRepository {
  constructor(private readonly prisma: PrismaService) {}

  private tolEntity(channel: PrismaChannelWithSubscribers): Channel {
    return Channel.create({
      description: channel.description,
      name: channel.name,
      subscribers: channel.subscribers.map((subscriber) => {
        return Subscriber.create(
          {
            recipientId: subscriber.recipientId,
            telegramChatId: subscriber.telegramId || '',
            createdAt: subscriber.createdAt,
          },
          new UniqueEntityID(subscriber.id),
        );
      }),
    });
  }

  async create(channel: Channel): Promise<void> {
    await this.prisma.channel.create({
      data: {
        id: channel.id,
        name: channel.name,
        createdAt: channel.createdAt,
        subscribers: {
          connect: map(channel.subscribers, ({ id }) => ({ id })),
        },
        description: channel.description,
      },
    });
  }
  async save(channel: Channel): Promise<void> {
    await this.prisma.channel.update({
      where: { id: channel.id },
      data: {
        createdAt: channel.createdAt,
        name: channel.name,
        subscribers: {
          connect: map(channel.subscribers, ({ id }) => ({ id })),
        },
      },
    });
  }
  async findById(channelId: string): Promise<Channel | null> {
    const results = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        subscribers: true,
      },
    });

    return results ? this.tolEntity(results) : null;
  }
}
