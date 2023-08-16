import type { RequestHandler } from './$types';
import { userSsePool } from '$lib/domain/Users';

export const GET: RequestHandler = async ({ params }) => {
	const userId = params.userId;

	const stream = new ReadableStream({
		start(controller) {
			userSsePool.addClient(userId, controller);
		},
		cancel() {
			userSsePool.removeClient(userId);
		}
	});

	return new Response(stream, {
		status: 200,
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache'
		}
	});
};
