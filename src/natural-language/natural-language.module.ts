import { Module } from '@nestjs/common';
import { NaturalLanguageController } from './natural-language.controller';
import { NaturalLanguageService } from './natural-language.service';
import { GooglePlacesModule } from 'src/google-places/google-places.module';
import { GooglePlacesService } from 'src/google-places/google-places.service';

@Module({
  controllers: [NaturalLanguageController],
  providers: [NaturalLanguageService, GooglePlacesService],
  imports: [GooglePlacesModule],
})
export class NaturalLanguageModule {}
