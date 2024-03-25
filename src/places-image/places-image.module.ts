import { Module } from '@nestjs/common';
import { PlacesImageService } from './places-image.service';
import { PlacesImageController } from './places-image.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceImageSchema, PlacesImage } from 'src/schema/places-photo.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: PlacesImage.name,
        schema: PlaceImageSchema
      }
    ]),
  ],
  controllers: [PlacesImageController],
  providers: [PlacesImageService],
})
export class PlacesImageModule {}
