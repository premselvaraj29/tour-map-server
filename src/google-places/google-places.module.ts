import { Module } from '@nestjs/common';
import { GooglePlacesController } from './google-places.controller';
import { GooglePlacesService } from './google-places.service';
import { RecommendationsGateway } from './google-places.gateway';
import { DbModule } from 'src/db-service/db.module';
import { DbService } from 'src/db-service/db.service';

@Module({
  controllers: [GooglePlacesController],
  imports: [DbModule],
  providers: [GooglePlacesService, RecommendationsGateway],
  exports: [GooglePlacesService, RecommendationsGateway],
})
export class GooglePlacesModule {}
