import { Injectable } from '@nestjs/common';
import * as language from '@google-cloud/language';
import { ITextAnalysisResult } from 'src/models/ITextAnalysisResult';
import { OnEvent } from '@nestjs/event-emitter';
import { DbService } from 'src/db-service/db.service';
import { TwitterService } from 'src/twitter/twitter.service';

@Injectable()
export class NaturalLanguageService {
  constructor(
    private dbService: DbService,
    private twitterService: TwitterService,
  ) {}

  async analyze(tweets: { text: string }[]) {
    const results: ITextAnalysisResult[] = [];
    for (const tweet of tweets) {
      const client = new language.v1.LanguageServiceClient();
      const document = {
        content: tweet.text,
        type: 'PLAIN_TEXT' as const,
      };
      const result = await client.analyzeSentiment({ document });
      // console.log(result);
      const sentiment = result[0].documentSentiment;

      const classificationModelOptions = {
        v2Model: {
          contentCategoriesVersion: 'V2' as const,
        },
      };

      const responseCategories = await client.classifyText({
        document: document,
        classificationModelOptions,
      });
      // console.log('TEXT CLASSIFICATION IS ');
      // console.log(responseCategories[0].categories);

      if (sentiment.score > 0.1) {
        //If the score is greater than 0.1, then the sentiment is positive
        results.push({
          score: sentiment.score,
          magnitude: sentiment.magnitude,
          categories: responseCategories[0].categories
            .filter((c) => c.confidence >= 0.3) //Filter out categories with low confidence
            .map((c) => ({
              name: c.name,
              confidence: c.confidence,
            })),
        });
      }
    }
    return results;
  }

  @OnEvent('user-tweets')
  async handleUserTweets(payload: { tweets: any[]; userDetails: any }) {
    const results = await this.analyze(payload.tweets);
    const dbPayload = {
      userId: payload.userDetails.id,
      sentiments: results,
    };

    if (
      await this.dbService
        .getDb()
        .collection('sentiments')
        .findOne({ username: payload.userDetails.id })
    ) {
      await this.dbService
        .getDb()
        .collection('sentiments')
        .findOneAndReplace({ username: payload.userDetails.id }, dbPayload);
    } else {
      await this.dbService
        .getDb()
        .collection('sentiments')
        .insertOne(dbPayload);
    }
  }
}
