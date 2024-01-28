import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistanceMatrixModule } from './distance-matrix/distance-matrix.module';
import { NaturalLanguageController } from './natural-language/natural-language.controller';
import { NaturalLanguageModule } from './natural-language/natural-language.module';
import { GooglePlacesModule } from './google-places/google-places.module';

@Module({
  imports: [DistanceMatrixModule, NaturalLanguageModule, GooglePlacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
