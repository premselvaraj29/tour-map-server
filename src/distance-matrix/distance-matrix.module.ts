import { Module } from '@nestjs/common';
import { DistanceMatrixController } from './distance-matrix.controller';
import { DistanceMatrixService } from './distance-matrix.service';

@Module({
  controllers: [DistanceMatrixController],
  providers: [DistanceMatrixService],
})
export class DistanceMatrixModule {}
