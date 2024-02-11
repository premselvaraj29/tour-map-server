import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TwitterProcessor } from './twitter.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/schema/tweet.schema';

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
  ],
  controllers: [TwitterController],
  providers: [TwitterService, TwitterProcessor],
})
export class TwitterModule {}
