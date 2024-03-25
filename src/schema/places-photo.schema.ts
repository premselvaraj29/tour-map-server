import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Binary } from "mongodb"
import { HydratedDocument } from "mongoose"

export interface PlacesImageType {
  placeId: string
  image: Binary
}

@Schema()
export class PlacesImage implements PlacesImageType {
  @Prop({ required: true, unique: true, index: true })
  placeId: string

  @Prop({ required: true, type: Buffer })
  image: Binary
}

export type PlaceImageDocument = HydratedDocument<PlacesImage>;
export const PlaceImageSchema = SchemaFactory.createForClass(PlacesImage);
