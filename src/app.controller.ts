import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimiterGuard } from './guards/rate-limiter/rate-limiter.guard';

@UseGuards(RateLimiterGuard)
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/limited')
  limited(): string {
    return this.appService.getHello() + 'from limited api.';
  }
  

  @Get('/unlimited')
  unlimited(): string {
    return this.appService.getHello() + ' from unlimited api.';
  }
}
