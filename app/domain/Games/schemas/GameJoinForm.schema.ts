import { z } from 'zod';

export const GameJoinFormSchema = z.object({
    gameCode: z.string().length(5, "Vous devez entrer un code de partie valide (C'est un code à 5 charactères)"),
});

export type GameJoinForm = z.infer<typeof GameJoinFormSchema>;
