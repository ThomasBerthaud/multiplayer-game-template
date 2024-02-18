import { z } from 'zod';

export const GameJoinFormSchema = z.object({
    gameCode: z.string(),
});

export type GameJoinForm = z.infer<typeof GameJoinFormSchema>;
