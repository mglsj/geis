import { z } from "zod";

export const signInSchema = z.object({
	username: z.coerce.string(),
	password: z.string().min(6),
});

export type SignInFormData = typeof signInSchema;
