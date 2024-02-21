import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.passthrough().parse(env),
      isGlobal: true,
    }),
  ],
  providers: [EnvService],

  exports: [EnvService],
})
export class EnvModule {}
