import { z } from 'zod';

export const GameLeaveFormSchema = z.object({
    noRedirect: z.coerce.boolean(),
});

export type GameLeaveForm = z.infer<typeof GameLeaveFormSchema>;
