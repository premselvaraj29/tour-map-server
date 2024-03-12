import { Module } from '@nestjs/common';
import { DistanceMatrixController } from './distance-matrix.controller';
import { DistanceMatrixService } from './distance-matrix.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [DistanceMatrixController],
  providers: [DistanceMatrixService],
})
export class DistanceMatrixModule {}
