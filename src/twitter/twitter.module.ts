import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TwitterProcessor } from './twitter.processor';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'twitter'
    }),
    ConfigModule],
  controllers: [TwitterController],
  providers: [TwitterService, TwitterProcessor],
})
export class TwitterModule {}
