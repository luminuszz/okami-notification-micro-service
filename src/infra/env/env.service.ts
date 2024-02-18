import { Injectable } from '@nestjs/common';
import { EnvType } from './env.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvType, true>) {}

  public get<Key extends keyof EnvType>(key: Key) {
    return this.configService.get<EnvType[Key]>(key, { infer: true });
  }
}
