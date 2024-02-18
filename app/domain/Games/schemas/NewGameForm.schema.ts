import { z } from 'zod';

export const MIN_NB_PLAYERS = 3;
export const MAX_NB_PLAYERS = 6;

export const NewGameFormSchema = z.object({
    partyName: z.string().min(3, 'party name too small').max(50, 'party name too big'),
    nbPlayers: z.coerce
        .number()
        .min(MIN_NB_PLAYERS, 'party must be at least 3 players')
        .max(MAX_NB_PLAYERS, 'party must be at most 6 players')
        .default(3),
});

export type NewGameForm = z.infer<typeof NewGameFormSchema>;
