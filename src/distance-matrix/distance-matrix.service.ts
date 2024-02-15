import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class DistanceMatrixService {
  async getDistanceMatrix(latLngArr: number[][]) {
    const result = [];
    for (let i = 0; i < latLngArr.length; i++) {
      const originStr = `${latLngArr[i][0]},${latLngArr[i][1]}`;
      let destinations = [];
      for (let j = 0; j < latLngArr.length; j++) {
        const element = latLngArr[j];
        destinations.push(element[0] + ',' + element[1]);
      }
      let destinationStr = destinations.join('|');
      const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}
      &destinations=${destinationStr}&key=AIzaSyCYYEd7y5K5e0kSPk-J39b2jO31qL7es1s`;
      const response = await axios.get(URL);
      const elements = response.data.rows[0].elements;
      const distances = elements.map((e) => e.distance.value);
      result.push(distances);
    }
    return result;
  }
}
