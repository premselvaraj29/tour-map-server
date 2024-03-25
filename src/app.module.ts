import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistanceMatrixModule } from './distance-matrix/distance-matrix.module';
import { NaturalLanguageController } from './natural-language/natural-language.controller';
import { NaturalLanguageModule } from './natural-language/natural-language.module';
import { GooglePlacesModule } from './google-places/google-places.module';
import { TwitterModule } from './twitter/twitter.module';
import config from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis-service/redis.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from './redis-service/redis.module';
import { DbModule } from './db-service/db.module';
import { PlacesImageModule } from './places-image/places-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    DistanceMatrixModule,
    NaturalLanguageModule,
    GooglePlacesModule,
    RedisModule,
    TwitterModule,
    DbModule,
    PlacesImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
