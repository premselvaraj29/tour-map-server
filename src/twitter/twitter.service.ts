import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { URLSearchParams } from 'url';

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

type TwitterUser = {
  id: string;
  name: string;
  username: string;
};

@Injectable()
export class TwitterService {
  private baseUrl = 'https://api.twitter.com/2';
  private config: TwitterConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<TwitterConfig>('twitter');
  }

  private generateBasicAuthToken() {
    return Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`,
      'utf-8',
    ).toString('base64');
  }

  async getOauthToken(
    code: string,
    error?: string,
  ): Promise<TwitterTokenResponse> {
    if (error) {
      console.log({
        message: 'Error occured.',
        details: { error },
      });

      throw new Error(
        `Error from twitter oauth. Message: ${JSON.stringify(error)}`,
      );
    }

    const tokenParam = {
      client_id: this.config.clientId,
      code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
      redirect_uri: 'http://www.localhost:3000/twitter/oauth',
      grant_type: 'authorization_code',
    };

    try {
      const body = new URLSearchParams({ ...tokenParam, code }).toString();
      const basicAuthToken = this.generateBasicAuthToken();
      const res = await axios.post<TwitterTokenResponse>(
        `${this.baseUrl}/oauth2/token`,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuthToken}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.log({
        message: 'Error occured.',
        details: { error, response: error.response.data },
      });
      throw error;
    }
  }

  async getUser(accessToken: string, tokenType: string) {
    try {
      const response = await axios.get<TwitterUserResponse>(
        `${this.baseUrl}/users/me`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `${tokenType} ${accessToken}`,
          },
        },
      );

      const userDetails = response.data.data ?? null;
      console.log({
        message: 'User Details',
        userDetails,
      });
      return userDetails;
    } catch (error) {
      return null;
    }
  }
}
