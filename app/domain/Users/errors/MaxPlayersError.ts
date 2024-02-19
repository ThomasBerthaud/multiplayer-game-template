import { ApiError } from '~/application/ApiError';

export class MaxPlayersError extends ApiError {
    constructor() {
        super('Max players reached', 400);
    }
}
