import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PlaceFilter, PlaceRequestParam } from 'src/type';
@Injectable()
export class GooglePlacesService {
  constructor(private readonly configService: ConfigService) {}

  async getPlaces(textQuery: string, options?: PlaceFilter) {
    const mapKey = this.configService.get<string>('gMapKey');
    if (!mapKey) {
      console.log({
        scope: 'GooglePlacesService::getPlaces',
        message: 'Map api key is missing'
      });
    }
    const params: Partial<PlaceRequestParam> = {
      query: textQuery,
      radius: '500',
      key: mapKey,
      location: options.location ? options.location.join(',') : '45.49668500000002,-73.57755583068695',
    }

    if (options.isOpenNow !== undefined) {
      params.opennow = options.isOpenNow
    }

    if (options.priceRange?.min !== undefined) {
      params.minprice = options.priceRange.min
    }

    if (options.priceRange?.max !== undefined) {
      params.maxprice = options.priceRange.max
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params
      },
    );

    if (!options?.ratings) {
      return response.data;
    }

    const results = response.data.results.filter((result) => {
      return (result.rating >= options.ratings)
    })

    response.data.results = results;
    return response.data;
  }
}
// opennow: true,
