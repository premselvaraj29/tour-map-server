import { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PlacesImageService } from './places-image.service';

@Controller('places-images')
export class PlacesImageController {
  constructor(private readonly placesImageService: PlacesImageService) { }

  @Get('/:placeId/:referenceId')
  async getImage(
    @Param('placeId') placeId: string,
    @Param('referenceId') referenceId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const imageBuffer = await this.placesImageService.getImage(placeId, referenceId);
      res.setHeader('Content-Type', 'image/x-icon');
      res.send(imageBuffer);
    } catch (error) {
      console.log({ error })
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
  }
}
