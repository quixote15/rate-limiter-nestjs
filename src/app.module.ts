import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BucketLimiterService } from './limiters/token-bucket';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BucketLimiterService],
})
export class AppModule {}
