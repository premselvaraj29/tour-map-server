import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DbService } from 'src/db-service/db.service';
import { flatten, uniq } from 'lodash';
import { GooglePlacesService } from './google-places.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this to match your Angular app's origin for security
  },
})
export class RecommendationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private dbService: DbService,
    private placesService: GooglePlacesService,
  ) {}

  @SubscribeMessage('requestRecommendations')
  async handleRecommendationRequest(client: any, payload: any): Promise<void> {
    const userId = payload.userId;
    // Fetch recommendations for the user from Redis or your database
    const recommendations = await this.getRecommendationsForUser(userId);
    // Emit the recommendations to the requesting client
    client.emit('updateRecommendations', recommendations);
  }

  // Mock function to simulate fetching recommendations
  private async getRecommendationsForUser(userId: string) {
    // Replace this with actual fetching logic

    const sentiments = await this.dbService
      .getDb()
      .collection('sentiments')
      .find()
      .toArray();
    console.log(sentiments);

    if (sentiments[0] !== undefined) {
      const nestedCategories = sentiments[0]['sentiments'].map(
        (i) => i.categories,
      );
      console.log(nestedCategories);

      const categories = flatten(nestedCategories);
      const categorySubCategory = {};
      console.log(categories);
      categories
        //@ts-ignore
        .map((i) => i.name)
        .map((i) => i.split('/')[1])
        .forEach((i) => (categorySubCategory[i] = []));

      console.log(categorySubCategory);
      categories
        //@ts-ignore
        .map((i) => i.name)
        .map((i) => [i.split('/')[1], i.split('/')[3]])
        //@ts-ignore
        .forEach(([m, s]) => {
          console.log(m, s);
          //@ts-ignore
          categorySubCategory[m].push(s);
        });

      console.log(categorySubCategory);

      for (const [key, value] of Object.entries(categorySubCategory)) {
        categorySubCategory[key] = uniq(value as string) as string[];
      }

      const placesPromises = [];

      for (const key of Object.keys(categorySubCategory)) {
        const subCategories = categorySubCategory[key];
        subCategories.forEach((subCategory) => {
          placesPromises.push(
            this.placesService.getPlaces(`${subCategory} near me`),
          );
        });
      }

      const places = await Promise.all(placesPromises);
      console.log(places);
      return places;
    }
  }
}
