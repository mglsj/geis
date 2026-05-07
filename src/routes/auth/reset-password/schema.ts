import { z } from "zod";

export const resetPasswordSchema = z.object({
	token: z.string(),
	newPassword: z.string().min(6),
});

export type ResetPasswordType = typeof resetPasswordSchema;
