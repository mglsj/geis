import { z } from "zod";

export const erpLoginFormSchema = z.object({
	username: z.coerce.string().min(4),
	password: z.string().min(6),
	captcha: z.string().length(6),
	token: z.string().min(1),
});

export type ErpLoginFormSchema = typeof erpLoginFormSchema;

export const signupFormSchema = z.object({
	password: z.string().min(6),
	profileId: z.string(),
	callbackURL: z.url().optional(),
});

export type SignupFormSchema = typeof signupFormSchema;
