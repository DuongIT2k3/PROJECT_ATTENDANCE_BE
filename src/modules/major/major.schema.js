import { z } from "zod";

export const createMajorSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		description: z.string().min(1, "Description is required"),
		code: z
			.string()
			.min(1, "Code is required")
			.regex(/^[A-Z]{2,}$/, "Code must be uppercase letters only"),
	})
	.strict();

export const updateMajorSchema = z
	.object({
		name: z.string().min(1, "Name is required").optional(),
		description: z.string().min(1, "Description is required").optional(),
		code: z
			.string()
			.min(1, "Code is required")
			.regex(/^[A-Z]{2,}$/, "Code must be uppercase letters only")
			.optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});