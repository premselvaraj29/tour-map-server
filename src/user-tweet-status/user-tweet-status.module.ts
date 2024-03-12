import { Module } from '@nestjs/common';
import { UserTweetStatusService } from './user-tweet-status.service';
import { UserTweetStatus, UserTweetStatusSchema } from 'src/schema/user-tweet.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserTweetStatus.name,
        schema: UserTweetStatusSchema
      }
    ]),
  ],
  providers: [UserTweetStatusService],
  exports: [UserTweetStatusService],
})
export class UserTweetStatusModule {}
