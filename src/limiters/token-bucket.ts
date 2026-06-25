

/***
 * 
 Step 2
In this step your goal is to implement the token bucket algorithm for rate limiting. The token bucket algorithm works like this:

There is a ‘bucket’ that has capacity for N tokens. Usually this is a bucket per user or IP address.
Every time period a new token is added to the bucket, if the bucket is full the token is discarded.
When a request arrives and the bucket contains tokens, the request is handled and a token is removed from the bucket.
When a request arrives and the bucket is empty, the request is declined.
For this step, implement this strategy such that the bucket is per IP address, has a capacity of 10 tokens with new tokens added at a rate of 1 token per second.

When a request is rejected you should return the HTTP status code of 429 - Too Many Requests.

Once you have implemented that you can use Postman to test it. There is a blog post that introduces the performance testing abilities of Postman and explains how to set it up here.

I configured a test to hit the limited API endpoint with 10 Virtual Users, as you can see that results in no errors initially, (the bucket had ten tokens, then after a second 90% of the requests fail as there are 10 users trying to access the API, but only one token being added per second.

 */

import { Injectable, Logger, NotFoundException, OnModuleDestroy, Scope } from "@nestjs/common"
import { setInterval,clearInterval } from "node:timers"
import { IncomingReq } from "./dtos"
import { TooManyRequestsException } from "./exceptions"




export default class TokenBucket {

    #tokens: string[]  
    private intervalId:  NodeJS.Timeout | null = null
    constructor(private readonly capacity = 10, private readonly period = 1000) {
        this.#tokens = Array(this.capacity).fill('TOKEN')
    }

    acceptRequest(_: IncomingReq): boolean {
        if(this.IsBucketEmpty()) throw new TooManyRequestsException()
        
        
        return this.#tokens.pop() !== undefined
    }

    startRefill() {
        this.intervalId = setInterval(() => {
                //Logger.log('startRefill started..')
                if(this.capacity > this.#tokens.length) {
                    Logger.log('Refiling 1 token to the bucket')
                    this.#tokens.push('TOKEN')
                } 
            }, this.period)
    }
    
    IsBucketEmpty() {
        return this.#tokens.length === 0
    }
    
    cleanUp() {
        if(this.intervalId !== null) {
            clearInterval(this.intervalId)
            // Extra safety to prevent double clean up
            this.#tokens = []
            this.intervalId = null
        }
    }
}

@Injectable({scope: Scope.DEFAULT})
export class BucketLimiterService  implements OnModuleDestroy{

    private readonly bucket:TokenBucket
    constructor() {
        this.bucket = new TokenBucket();
        this.bucket.startRefill();
    }

    acceptRequest(req: IncomingReq): boolean {
        try {
            const isAcceptable = this.bucket.acceptRequest(req)
            Logger.log('Accepting request from ip ' + req.ip + ' accept=' + isAcceptable)
            return isAcceptable
        } catch (error) {
            return false
        }
    }

    onModuleDestroy() {
        Logger.log('Cleaning up bucket limiter')
        this.bucket.cleanUp()
    }
    
}