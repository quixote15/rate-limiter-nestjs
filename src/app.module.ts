import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitService } from './services/rate-limit-service';
import TokenBucket from './limiters/token-bucket';
import FixedWindow from './limiters/fixed-window';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, 

    {
      provide: RateLimitService,
      useFactory: () => {
        return new RateLimitService(new FixedWindow())
      },
      scope: Scope.DEFAULT
    }
  ],
})
export class AppModule {}
