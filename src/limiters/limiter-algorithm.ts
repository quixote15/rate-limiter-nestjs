import { IncomingReq } from "./dtos";

export abstract class LimiterAlgorithm {
    abstract acceptRequest(request: IncomingReq);
    abstract initialize(): void;
    abstract cleanUp(): void;
}
