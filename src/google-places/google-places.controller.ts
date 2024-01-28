import { Controller, Get, Query, Req } from '@nestjs/common';
import { GooglePlacesService } from './google-places.service';

@Controller('google-places')
export class GooglePlacesController {
  constructor(private googlePlacesService: GooglePlacesService) {}

  @Get()
  async getPlaces(@Query() query: Request) {
    return await this.googlePlacesService.getPlaces(query['textQuery']);
  }
}
