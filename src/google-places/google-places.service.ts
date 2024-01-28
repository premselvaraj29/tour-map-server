import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class GooglePlacesService {
  async getPlaces(textQuery: string) {
    console.log('textQuery is ' + textQuery);

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          location: '45.49668500000002,-73.57755583068695',
          query: textQuery,
          radius: '1000',
          key: 'YOUR_API_KEY',
        },
      },
    );

    return response.data;
  }
}
