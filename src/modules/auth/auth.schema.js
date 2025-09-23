import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
	password: z
		.string()
		.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/,
			"Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
		),
	phoneNumber: z.string().optional(),
	fullname: z.string().min(6, "Họ và tên tối thiểu 6 ký tự"),
});

export const loginSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
	password: z
		.string()
		.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&.])[A-Za-z\d@$#!%*?&.]+$/,
			"Mật khẩu phải chứa ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt"
		),
});

export const resetPasswordSchema = z.object({
	resetToken: z.string().min(1, "Reset token là bắt buộc"),
	newPassword: z
		.string()
		.min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/,
			"Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
		),
});