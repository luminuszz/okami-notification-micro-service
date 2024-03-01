import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envSchema } from './infra/env/env.schema';

(async () => {
  const env = await envSchema.parseAsync(process.env);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USER,
      password: env.REDIS_PASSWORD,
    },
  });

  await app.listen();
})();
