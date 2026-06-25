import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Request} from 'express'
import { RateLimitService } from 'src/services/rate-limit-service';

@Injectable({scope: Scope.DEFAULT})
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly limiter: RateLimitService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const ip = request.ip || ''
    const url = request.url || ''


    if (!this.limiter.acceptRequest({url, ip})) {
      Logger.log('Too many requests reached')
      throw new HttpException('Too many requests, try again later.',HttpStatus.TOO_MANY_REQUESTS)
    }

    return true
  }
}
