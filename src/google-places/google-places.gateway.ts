import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DbService } from 'src/db-service/db.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this to match your Angular app's origin for security
  },
})
export class RecommendationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private dbService: DbService) {}

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
    return [
      { place: 'Central Park', location: 'New York', userId: userId },
      { place: 'Eiffel Tower', location: 'Paris', userId: userId },
    ];
  }
}
