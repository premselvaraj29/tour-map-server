import { Job } from 'bull';
import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { TokenDetail, TwitterService, TwitterUser } from './twitter.service';

@Processor('twitter')
export class TwitterProcessor {

    constructor(
        @Inject(JOB_REF) jobRef: Job,
        private readonly twitterService: TwitterService
    ) {}

    @Process('user-tweets')
    // TODO: Use token to get the tweets and store in DB
    async handleUserTweets(job: Job<{ token: any }>) {
        const { token } = job.data

        console.log({
            scope: 'TwitterProcessor::handleUserTweets',
            token,
        })

        const userDetails = await this.twitterService
            .setUpClient(token.access_token)
            .getUserDetail();

        console.log({ 
            scope: 'TwitterProcessor::handleUserTweets',
            userDetails,
        })
    }
}
