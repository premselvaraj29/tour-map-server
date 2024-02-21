import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('twitter')
export class TwitterController {
  constructor(
    private readonly configService: ConfigService,
    private readonly twitterService: TwitterService,
    @InjectQueue('twitter') private readonly twitterQueue: Queue,
  ) {}

  @Get('/login')
  async login(@Res({ passthrough: true }) res: Response) {
    const url = this.twitterService.generateAuthUrl();
    return res.redirect(302, url);
  }

  @Get('oauth')
  async oauth(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error?: string,
  ) {
    const { token } = await this.twitterService.requestAccessToken(code, state);
    const userDetails = await this.twitterService.getUserDetail();

    // Trigger twitter job to get user data
    this.twitterQueue.add('user-tweets', { token }).catch((error) => {
      Logger.log({ error }, 'Queue');
    });

    res.cookie('user_id', userDetails.id, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      expires: new Date(Date.now() + 7200 * 1000),
    });

    res.cookie('user_name', userDetails.username, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      expires: new Date(Date.now() + 7200 * 1000),
    });
    const clientURL = this.configService.get<string>('clientURL');
    return res.redirect(302, clientURL);
  }
}
