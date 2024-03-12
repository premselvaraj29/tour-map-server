import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTweetStatusType = {
  userId: string
  updatedAt: Date
}

@Schema()
export class UserTweetStatus {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ type: Date, required: true })
  updatedAt: Date
}

export type UserTweetStatusDocument = HydratedDocument<UserTweetStatus>;
export const UserTweetStatusSchema = SchemaFactory.createForClass(UserTweetStatus);
