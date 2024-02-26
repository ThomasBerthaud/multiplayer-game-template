export class GameNotFoundError extends Response {
    constructor() {
        super(null, {
            status: 404,
            statusText: 'Game Not Found',
        });
    }
}
