import { z } from "zod";

export const formSchema = z.object({
	token: z.string(),
	password: z.string().min(6),
});

export type FormSchema = typeof formSchema;
