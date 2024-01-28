import { Controller, Get, Post, Req } from '@nestjs/common';
import { DistanceMatrixService } from './distance-matrix.service';

@Controller('distance-matrix')
export class DistanceMatrixController {
  constructor(private distanceService: DistanceMatrixService) {}
  @Post()
  async getDistanceMatrix(@Req() request: Request) {
    const data = request.body['data'];
    return await this.distanceService.getDistanceMatrix(data);
  }
}
