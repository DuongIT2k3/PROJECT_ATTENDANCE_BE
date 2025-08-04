import { z } from "zod";


export const createSubjectSchema = z
	.object({
		name: z.string().min(1, "Tên không được bỏ trống"),
        englishName: z.string().min(1, "Tên tiếng anh không được bỏ trống"),
		description: z.string().optional(),
	
	})
	.strict();

export const updateSubjectSchema = z
	.object({
		name: z.string().min(1, "Tên không được bỏ trống").optional(),
        englishName: z.string().min(1, "Tên tiếng anh không được bỏ trống").optional(),
		description: z.string().min(1, "Mô tả không được bỏ trống").optional(),
		deletedAt: z.date().optional().nullable(),	
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Ít nhất một trường phải được cung cấp để cập nhật",
	});