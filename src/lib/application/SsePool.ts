export class SsePool {
	constructor(private clients: Map<string, ReadableStreamDefaultController>) {}

	addClient(id: string, controller: ReadableStreamDefaultController) {
		if (this.clients.has(id)) {
			this.clients.get(id)?.close();
		}
		this.clients.set(id, controller);
	}

	getClient(id: string) {
		return this.clients.get(id);
	}

	removeClient(id: string) {
		this.clients.delete(id);
	}
}
