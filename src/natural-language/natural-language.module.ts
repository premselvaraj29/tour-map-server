import { Module } from '@nestjs/common';
import { NaturalLanguageController } from './natural-language.controller';
import { NaturalLanguageService } from './natural-language.service';
import { GooglePlacesModule } from 'src/google-places/google-places.module';
import { GooglePlacesService } from 'src/google-places/google-places.service';
import { TwitterModule } from 'src/twitter/twitter.module';
import { DbService } from 'src/db-service/db.service';
import { DbModule } from 'src/db-service/db.module';
import { TwitterService } from 'src/twitter/twitter.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [NaturalLanguageController],
  providers: [NaturalLanguageService],
  imports: [GooglePlacesModule, DbModule, TwitterModule, ConfigModule],
  exports: [NaturalLanguageService],
})
export class NaturalLanguageModule {}
