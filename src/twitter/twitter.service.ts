import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { Client, auth } from "twitter-api-sdk";

type TwitterConfig = {
  clientId: string;
  clientSecret: string;
};

type TwitterTokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
};

type TwitterUserResponse = {
  data: TwitterUser;
};

export type TwitterUser = {
  id: string;
  name: string;
  username: string;
};

export type TokenDetail = {
  accessToken: string,
  tokenType: string,
  scope: string,
  refresh_token: string,
  expires_at: number
}

const STATE = 'pagal:state'

@Injectable()
export class TwitterService {
  private readonly baseUrl = 'https://api.twitter.com/2';
  private config: TwitterConfig;
  private client: Client
  private authClient: auth.OAuth2User

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<TwitterConfig>('twitter');
    this.client = this.newTwitterClient();
  }

  private newTwitterClient() {
    this.authClient = new auth.OAuth2User({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      callback: "http://www.localhost:3000/twitter/oauth",
      scopes: ["tweet.read", "users.read", "offline.access"],
    });
    return new Client(this.authClient)
  }

  generateAuthUrl() {
    const authUrl = this.authClient.generateAuthURL({
      state: STATE,
      code_challenge_method: 's256',
    })
    return authUrl;
  }

  async requestAccessToken(code: string, state: string): Promise<{ token: any }> {
    if (state !== STATE) throw new Error("State isn't matching.")
    try {
      const token = await this.authClient.requestAccessToken(code)
      return token
    } catch (error) {
      console.log({ scope: 'requestAccessToken', error })
      Logger.error(error);
    }
  }

  async getUserDetail() {
    const details = (await this.client.users.findMyUser()).data ;
    return details as TwitterUser;
  }

  setUpClient(token: string) {
    this.client = new Client(token);
    return this
  }
}
