import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Binary } from 'mongodb';
import { Model } from 'mongoose';
import { PlacesImage, PlacesImageType } from 'src/schema/places-photo.schema';

@Injectable()
export class PlacesImageService {

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(PlacesImage.name) private readonly placesImageModel: Model<PlacesImage>
  ) { }

  private addImage(placeObj: PlacesImageType) {
    const placeImage = new this.placesImageModel(placeObj);
    return placeImage.save();
  }

  private findImageByReference(placeId: string) {
    const placesImage = this.placesImageModel.findOne({
      placeId
    });
    return placesImage.lean();
  }

  private async getImageFromCloud(placeId: string, referenceId: string) {
    if (!referenceId) {
      throw new Error('Not a valid referenceId.');
    }
    const apiKey = this.configService.get<string>('gMapKey');
    if (!apiKey) {
      console.log({
        scope: 'DistanceMatrixService::getDistanceMatrix',
        message: 'Api key is missing'
      });
      return;
    }
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/photo', {
      params: {
        key: apiKey,
        maxwidth: 200,
        maxheight: 200,
        photo_reference: referenceId
      },
      responseType: "arraybuffer"
    })
    const responseBuffer = Buffer.from(response.data, 'base64')
    const base64Image = responseBuffer.toString('base64');

    this.addImage({ placeId, image: Binary.createFromBase64(base64Image) })
      .then(() => {
        console.log({
          scope: 'PlacesImageService::getImageFromCloud',
          message: 'Image added to datastore',
          placeId
        })
      }).catch((error) => {
        console.log({
          scope: 'PlacesImageService::getImageFromCloud',
          message: 'Error adding Image to datastore',
          error,
        })
      })
    return { imageBuffer: responseBuffer, base64Image };
  }

  public async getImage(placeId: string, referenceId: string) {
    const placeImage = await this.findImageByReference(placeId)
    if (placeImage) {
      // console.log({
      //   scope: 'PlacesImageService::findImageByReference',
      //   message: 'Returning image from datastore.'
      // })
      return placeImage.image.buffer
    }
    const { imageBuffer } = await this.getImageFromCloud(placeId, referenceId);
    return imageBuffer;
  }
}
