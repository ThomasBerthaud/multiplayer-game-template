export class MaxPlayersError extends Response {
    constructor() {
        super(null, {
            status: 400,
            statusText: 'Max Players Reached',
        });
    }
}
