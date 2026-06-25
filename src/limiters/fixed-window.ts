import { IncomingReq } from "./dtos";
import { TooManyRequestsException } from "./exceptions";


/**
 * In this step your goal is to fixed window counter algorithm. The fixed window counter algorithm works like this:

A window size of N seconds is used to track the request rate. Each incoming request increments the counter for the window.
If the counter exceeds a threshold, the request is discarded.
The windows are typically defined by the floor of the current timestamp, so 17:47:13 with a 60 second window length, would be in the 17:47:00 window.
Again you can use Postman to test this, I used 10 Virtual Users with a 60 second window and 60 request threshold. You can see the distinct pattern of requests succeeding just after the window changes followed by a number of rejections


 */

const ONE_MINUTE_IN_MILIS = 6e4 // 1000 * 60

const getCurrentFlooredDateMinute = () => {
    return new Date(Math.floor( (Date.now() / ONE_MINUTE_IN_MILIS)  ) * ONE_MINUTE_IN_MILIS)
}

export default class FixedWindow {

    private currentTw: Date
    private counter: number
    constructor(private readonly capacity = 60, private readonly period = 60) {
        this.currentTw = getCurrentFlooredDateMinute()
        this.counter = 0
    }

    acceptRequest(req: IncomingReq) : boolean{
        const currentTs = getCurrentFlooredDateMinute()

        // reset outdated window
       if(currentTs > this.currentTw) {
            this.currentTw = currentTs
            this.counter = 0
       }


       if (this.counter >= this.capacity) {
        throw new TooManyRequestsException()
       }


       this.counter++
       return true
    }
   
}