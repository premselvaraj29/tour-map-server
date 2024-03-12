import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable()
export class GooglePlacesService {
  constructor(private readonly configService: ConfigService) {}

  async getPlaces(textQuery: string) {
    const mapKey = this.configService.get<string>('gMapKey');
    if (!mapKey) {
      console.log({
        scope: 'GooglePlacesService::getPlaces',
        message: 'Map api key is missing'
      });
    }
    
    console.log('textQuery is ' + textQuery);

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          location: '45.49668500000002,-73.57755583068695',
          query: textQuery,
          radius: '500',
          key: mapKey,
          opennow: true,
          minprice: 2,
        },
      },
    );

    return response.data;
  }
}
// opennow: true,
