import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BucketLimiterService } from 'src/limiters/token-bucket';
import {Request} from 'express'
@Injectable({scope: Scope.DEFAULT})
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly limiter: BucketLimiterService) {}
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
