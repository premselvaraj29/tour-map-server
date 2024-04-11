import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = await MongoClient.connect(
      this.configService.get('database.uri'),
    );
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getDb() {
    return this.client.db('BusinessTrip');
  }
}

@Injectable()
export class DatabaseService {}
