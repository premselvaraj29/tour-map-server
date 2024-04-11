import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {replace} from 'lodash';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  client: Redis;
  constructor(private configService: ConfigService) {
    this.connectToRedis();
  }

  connectToRedis() {
    // console.log('REDIS_URL', this.configService.get('REDIS_HOST'));
    // console.log('REDIS_PASSWORD', this.configService.get('REDIS_PASSWORD'));
    // console.log(replace(this.configService.get('REDIS_HOST'),"<password>",this.configService.get('REDIS_PASSWORD')));
    
    // const redisUrl = replace(this.configService.get('REDIS_HOST'),"<password>",this.configService.get('REDIS_PASSWORD'));
    // //console.log('redisUrl', redisUrl.length);
    
    // try {
    //   this.client = new Redis(redisUrl);
    // } catch (error) {
    //   console.error("Error connecting to Redis", error)
    // }
    

    this.client = new Redis(
      this.configService.get('REDIS_HOST'),
      this.configService.get('REDIS_PORT'),
  
    );
  }
}

// REDIS_HOST=redis://default:<password>@redis-11729.c279.us-central1-1.gce.cloud.redislabs.com:11729
// REDIS_PORT=11729