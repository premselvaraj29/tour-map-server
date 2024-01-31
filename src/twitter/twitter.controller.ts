import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(
    private readonly configService: ConfigService,
    private readonly twitterService: TwitterService,
  ) {}

  @Get('oauth')
  async oauth(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Query('error') error?: string,
  ) {
    const { access_token, token_type } =
      await this.twitterService.getOauthToken(code, error);
    const userDetails = await this.twitterService.getUser(
      access_token,
      token_type,
    );
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
