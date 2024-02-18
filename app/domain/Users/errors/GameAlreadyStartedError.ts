export class GameAlreadyStartedError extends Error {
	constructor() {
		super();
		this.name = 'GameAlreadyStartedError';
		this.message = 'Game already started';
	}
}
