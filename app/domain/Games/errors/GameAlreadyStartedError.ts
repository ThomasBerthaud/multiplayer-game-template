export class GameAlreadyStartedError extends Response {
    constructor() {
        super(null, {
            status: 400,
            statusText: 'Game Already Started',
        });
    }
}
