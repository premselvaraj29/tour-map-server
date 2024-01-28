import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { NaturalLanguageService } from './natural-language.service';
import { GooglePlacesService } from 'src/google-places/google-places.service';

@Controller('natural-language')
export class NaturalLanguageController {
  constructor(
    private naturalLanguageService: NaturalLanguageService,
    private placesService: GooglePlacesService,
  ) {}

  @Get()
  getHello(): string {
    return 'This action returns a new natural-Prem';
  }

  @Post('')
  async analyze(@Req() request: Request) {
    const tweet = request.body['data'];
    const nlpResult = await this.naturalLanguageService.analyze(tweet);
    const categories = nlpResult.map((r) => r.categories).flat();
    const categoryNames = categories.map((c) => c.name.split('/').pop());
    const categoryNamesUnique = [...new Set(categoryNames)];
    const placesResult = [];
    for (const categoryName of categoryNamesUnique) {
      const places = await this.placesService.getPlaces(categoryName);

      placesResult.push(places);
    }
    return placesResult;
  }
}
