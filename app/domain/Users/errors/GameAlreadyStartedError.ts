import { ApiError } from '~/application/ApiError';

export class GameAlreadyStartedError extends ApiError {
    constructor() {
        super('Game already started', 400);
    }
}
