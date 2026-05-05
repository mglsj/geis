import { z } from "zod";

export const formSchema = z.object({
	username: z.coerce.string(),
	password: z.string().min(6),
});

export type FormSchema = typeof formSchema;
