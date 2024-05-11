import { z } from 'zod';

export const UserEditFormSchema = z.object({
    user_name: z.string().min(3, 'Username must be at least 3 characters'),
});

export type UserEditForm = z.infer<typeof UserEditFormSchema>;
