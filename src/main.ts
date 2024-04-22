import { NestFactory } from '@nestjs/core';
import { AppModule } from '@infra/app.module';
import { envSchema } from '@infra/env/env.schema';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

(async () => {
  const env = await envSchema.parseAsync(process.env);

  console.log({ env });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [env.KAFKA_BROKER],
        ssl: true,
        sasl: {
          username: env.KAFKA_USER,
          password: env.KAFKA_PASSWORD,
          mechanism: 'plain',
        },
      },
      consumer: {
        groupId: 'okami-consumers',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.listen();
})();
