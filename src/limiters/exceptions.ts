export class TooManyRequestsException extends Error {
    readonly code = 'TOO_MANY_REQUESTS'
    constructor() {
        super('Too many requests.')
    }
}
