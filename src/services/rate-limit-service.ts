import { Injectable, Scope, OnModuleDestroy, Logger } from "@nestjs/common";
import { IncomingReq } from "src/limiters/dtos";
import { LimiterAlgorithm } from "src/limiters/limiter-algorithm";


@Injectable({scope: Scope.DEFAULT})
export class RateLimitService  implements OnModuleDestroy{

    constructor(private readonly limiter: LimiterAlgorithm) {
        this.limiter.initialize()
    }

    acceptRequest(req: IncomingReq): boolean {
        try {
            const isAcceptable = this.limiter.acceptRequest(req)
            Logger.log('Accepting request from ip ' + req.ip + ' accept=' + isAcceptable)
            return isAcceptable
        } catch (error) {
            return false
        }
    }

    onModuleDestroy() {
        Logger.log('Cleaning up bucket limiter')
        this.limiter.cleanUp()
    }
    
}