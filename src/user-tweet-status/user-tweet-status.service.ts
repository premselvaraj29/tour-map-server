import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserTweetStatus } from 'src/schema/user-tweet.schema';

@Injectable()
export class UserTweetStatusService {
  constructor(@InjectModel(UserTweetStatus.name) private userTweetStatusModel: Model<UserTweetStatus>) { }

  create(userId: string) {
    const userTweetStatus = new this.userTweetStatusModel({
      userId,
      updatedAt: new Date(),
    })
    return userTweetStatus.save();
  }

  findOne(userId: string, options?: { isLean: boolean }) {
    const userTweetStatus = this.userTweetStatusModel.findOne({
      userId
    })
    if (options?.isLean) {
      return userTweetStatus.lean()
    }
    return userTweetStatus;
  }
}
