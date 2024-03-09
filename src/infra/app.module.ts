import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { EnvModule } from './env/env.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [PrismaModule, NotificationModule, EnvModule, SubscriberModule],
  controllers: [AppController],
})
export class AppModule {}
