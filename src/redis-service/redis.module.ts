import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [RedisService, ConfigService],
  exports: [RedisService],
})
export class RedisModule {}
