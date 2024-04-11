import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { RedisService } from 'src/redis-service/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { TwitterService } from './twitter.service';
import { UserTweetStatusService } from 'src/user-tweet-status/user-tweet-status.service';

const wait = (miliSecond: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, miliSecond);
  })
}

const getUnique = (array: any[]) => {
  return [...new Set(array)];
}

@Processor('twitter')
export class TwitterProcessor {
  constructor(
    @Inject(JOB_REF) jobRef: Job,
    private readonly twitterService: TwitterService,
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
    private readonly userTweetStatusService: UserTweetStatusService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Checks if the tweets were already fetched. This is to reduce the number of calls to Twitter
   * which throws Too Many Request error
   */
  private async shouldProcess(userId: string): Promise<boolean> {
    const userStatus = await this.userTweetStatusService.findOne(userId);
    if (!userStatus) return true;
    const threshold = this.configService.get<number>('tweetUpdateAfter');
    const now = Date.now();
    if (now - userStatus.updatedAt.getTime() >= (threshold * 86_400_000)) {
      return true;
    }
    return false;
  }

  private async getUserTweets(userId: string) {
    const tweets = [];
    const tweetPromises = [
      this.twitterService.getUserTweets(userId),
      this.twitterService.getLikedTweets(userId),
    ]

    const [userTweets, userLikedTweets] = await Promise.all(tweetPromises);

    if (userTweets.meta.result_count !== 0) {
      tweets.push(...userTweets.data);
    }
    if (userLikedTweets.meta.result_count === 0) {
      return tweets;
    }

    const likedUserLists = userLikedTweets.data.map((tweet) => {
      tweets.push(tweet);
      return tweet.author_id;
    });

    const uniqueLikedUserLists = getUnique(likedUserLists);

    console.log({
      scope: 'TwitterProcessor:handleUserTweets',
      likedUserLists: uniqueLikedUserLists,
    });

    for (let index = 0; index < uniqueLikedUserLists.length; index++) {
      const userId = uniqueLikedUserLists[index];
      // Rate Limit 5 call every 15 minutes.
      // await wait(30000);
      console.log({
        scope: 'TwitterProcessor:handleUserTweets',
        message: `Getting tweets for user: ${userId}`,
      });
      const likedUserTweets = await this.twitterService.getUserTweets(userId);
      if (likedUserTweets.data.length) {
        tweets.push(...likedUserTweets.data);
      }
    }

    return tweets;
  }

  @Process('user-tweets')
  async handleUserTweets(job: Job<{ token: any }>) {
    console.log({
      scope: 'TwitterProcessor:handleUserTweets',
      message: 'Processing started.',
    });
    try {
      const userDetails = await this.twitterService.getUserDetail();
      const shouldProcessTweets = await this.shouldProcess(userDetails.id);
      if (!shouldProcessTweets) { return }

      const tweets = await this.getUserTweets(userDetails.id);
      console.log({
        scope: 'TwitterProcessor:handleUserTweets',
        message: 'User tweets',
        tweetsCount: tweets.length,
      })

      if (tweets.length > 0) {
        const userStatus = await this.userTweetStatusService.findOne(userDetails.id);
        if (!userStatus) {
          await this.userTweetStatusService.create(userDetails.id)
        }
      }

      if (tweets.length > 0) {
        for (let i = 0; i < tweets.length; i++) {
          const element = tweets[i];
          try {
            await this.redisService.client.lpush('tweets', JSON.stringify(element));
          } catch (error) {
            console.error("Error pushing tweet to redis", error)
          }
        }
      }

      this.eventEmitter.emit('user-tweets', {
        tweets,
        userDetails,
      });

      console.log({
        scope: 'TwitterProcessor:handleUserTweets',
        message: 'Processing Completed.',
      });
    } catch (error) {
      console.log({
        scope: 'TwitterProcessor:handleUserTweets',
        message: 'Failed processing twitter job.',
        error
      })
    }
  }
}
