import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TwitterProcessor } from './twitter.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/schema/tweet.schema';
import { RedisModule } from 'src/redis-service/redis.module';
import { UserTweetStatus, UserTweetStatusSchema } from 'src/schema/user-tweet.schema';
import { UserTweetStatusModule } from 'src/user-tweet-status/user-tweet-status.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tweet.name,
        schema: TweetSchema,
      },
      {
        name: UserTweetStatus.name,
        schema: UserTweetStatusSchema
      },
    ]),
    BullModule.registerQueueAsync({
      name: 'twitter',
    }),
    RedisModule,
    UserTweetStatusModule,
  ],
  controllers: [TwitterController],
  providers: [TwitterService, TwitterProcessor],
  exports: [TwitterService],
})
export class TwitterModule {}
