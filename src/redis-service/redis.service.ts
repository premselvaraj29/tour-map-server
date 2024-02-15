import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  client: Redis;
  constructor(private configService: ConfigService) {
    this.connectToRedis();
  }

  connectToRedis() {
    this.client = new Redis(
      this.configService.get('redis.port'),
      this.configService.get('redis.host'),
    );
  }
}
