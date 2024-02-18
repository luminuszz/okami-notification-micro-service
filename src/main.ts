import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.AMQP_URL)],
      queue: 'notification-service-queue',
    },
  });

  await app.listen();
})();
