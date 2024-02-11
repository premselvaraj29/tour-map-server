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

@Module({
  imports: [
    DistanceMatrixModule,
    NaturalLanguageModule,
    GooglePlacesModule,
    TwitterModule,
    ConfigModule.forRoot({
      load: [config],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
