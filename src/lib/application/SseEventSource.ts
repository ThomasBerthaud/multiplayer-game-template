export class SseEventSource<T extends { event: string; data: unknown }> {
	eventSource: EventSource;
	constructor(sourceUrl: string) {
		this.eventSource = new EventSource(sourceUrl);
		this.eventSource.addEventListener('error', (error) => {
			console.error(error);
		});
	}

	// TODO improve type safety
	addEventListener<Event extends T>(
		event: Event['event'],
		listener: (event: MessageEvent<Event['data']>) => void
	) {
		this.eventSource.addEventListener(event, (event) =>
			listener({
				...event,
				data: JSON.parse(event.data)
			})
		);
	}

	close() {
		this.eventSource.close();
	}
}
