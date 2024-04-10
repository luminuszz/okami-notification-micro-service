import { NestFactory } from '@nestjs/core';
import { AppModule } from '@infra/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envSchema } from '@infra/env/env.schema';

(async () => {
  const env = await envSchema.parseAsync(process.env);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [env.RABBIT_MQ_URL],
    },
  });

  await app.listen();
})();
