import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TwitterProcessor } from './twitter.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/schema/tweet.schema';
import { RedisModule } from 'src/redis-service/redis.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tweet.name,
        schema: TweetSchema,
      },
    ]),
    BullModule.registerQueueAsync({
      name: 'twitter',
    }),
    RedisModule,
  ],
  controllers: [TwitterController],
  providers: [TwitterService, TwitterProcessor],
  exports: [TwitterService],
})
export class TwitterModule {}
