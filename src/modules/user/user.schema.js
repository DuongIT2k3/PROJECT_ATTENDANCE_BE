import { z } from "zod";
export const updateRoleSchema = z.object({
  role: z.enum(["superAdmin", "teacher", "student"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be superAdmin, teacher, or student",
  }),
});

export const blockUserSchema = z.object({
  isBlocked: z.boolean({
    required_error: "isBlocked is required",
    invalid_type_error: "isBlocked must be a boolean",
  }),
});

export const updateProfileSchema = z
  .object({
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Phải cung cấp ít nhất một trường để cập nhật",
  });

export const createUserSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    role: z.enum(["teacher", "student"]).optional(),
    majorId: z.string().optional(),
  })
  .strict();