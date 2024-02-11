import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Tweet {
  @Prop()
  userId: string;

  @Prop([Object])
  tweets: any[];
}

export type TweetDocument = HydratedDocument<Tweet>;
export const TweetSchema = SchemaFactory.createForClass(Tweet);
