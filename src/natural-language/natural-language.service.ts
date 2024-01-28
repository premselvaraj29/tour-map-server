import { Injectable } from '@nestjs/common';
import * as language from '@google-cloud/language';
import { ITextAnalysisResult } from 'src/models/ITextAnalysisResult';

@Injectable()
export class NaturalLanguageService {
  async analyze(tweets: { text: string }[]) {
    const results: ITextAnalysisResult[] = [];
    for (const tweet of tweets) {
      const client = new language.v1.LanguageServiceClient();
      const document = {
        content: tweet.text,
        type: 'PLAIN_TEXT' as const,
      };
      const result = await client.analyzeSentiment({ document });
      console.log(result);
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
      console.log('TEXT CLASSIFICATION IS ');
      console.log(responseCategories[0].categories);

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
}
