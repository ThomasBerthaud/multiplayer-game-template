export class MaxPlayersError extends Error {
	constructor() {
		super();
		this.name = 'MaxPlayersError';
		this.message = 'Max players reached';
	}
}
