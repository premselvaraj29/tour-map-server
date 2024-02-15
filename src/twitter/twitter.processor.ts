import { Job } from 'bull';
import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { TokenDetail, TwitterService, TwitterUser } from './twitter.service';
import { RedisService } from 'src/redis-service/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('twitter')
export class TwitterProcessor {
  constructor(
    @Inject(JOB_REF) jobRef: Job,
    private readonly twitterService: TwitterService,
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Process('user-tweets')
  // TODO: Use token to get the tweets and store in DB
  async handleUserTweets(job: Job<{ token: any }>) {
    const { token } = job.data;

    console.log({
      scope: 'TwitterProcessor::handleUserTweets',
      token,
    });

    const userDetails = await this.twitterService
      .setUpClient(token.access_token)
      .getUserDetail();

    // console.log(await this.twitterService.getUserTweets());
    const tweets = await this.twitterService.getUserTweets();

    if (tweets['data'].length > 0) {
      for (let i = 0; i < tweets['data'].length; i++) {
        const element = tweets['data'][i];
        await this.redisService.client.lpush('tweets', JSON.stringify(element));
      }
    }

    this.eventEmitter.emit('user-tweets', {
      tweets: tweets['data'],
      userDetails,
    });
  }
}
