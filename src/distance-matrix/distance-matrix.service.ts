import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DistanceMatrixService {

  constructor(private readonly configService: ConfigService) {}

  async getDistanceMatrix(latLngArr: number[][]) {
    const mapKey = this.configService.get<string>('gMapKey');
    if (!mapKey) {
      console.log({
        scope: 'DistanceMatrixService::getDistanceMatrix',
        message: 'Map api key is missing'
      });
    }

    const result = [];
    const timeResult = [];
    for (let i = 0; i < latLngArr.length; i++) {
      const originStr = `${latLngArr[i][0]},${latLngArr[i][1]}`;
      let destinations = [];
      for (let j = 0; j < latLngArr.length; j++) {
        const element = latLngArr[j];
        destinations.push(element[0] + ',' + element[1]);
      }
      let destinationStr = destinations.join('|');
      const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}
      &destinations=${destinationStr}&key=${mapKey}`;
      const response = await axios.get(URL);
      const elements = response.data.rows[0].elements;
      console.log(elements);

      const distances = elements.map((e) => e.distance.value);
      const times = elements.map((e) => e.duration.value / 60);
      timeResult.push(times);
      result.push(distances);
    }
    return { distance_matrix: result, time_matrix: timeResult };
  }
}
