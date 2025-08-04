import { FRONTEND_URL, RESET_PASSWORD_EXPIRES } from "../../common/configs/environments.js";
import { generateStudentId, generateUsername } from "../../common/utils/code-generator.js";
import { throwError } from "../../common/utils/create-error.js";
import { signToken, verifyToken } from "../../common/utils/jwt.js";
import { comparePassword, hashPassword } from "../../common/utils/password-handler.js";
import sendEmail from "../../common/utils/send-email.js";
import User from "../user/user.model.js";
import MESSAGES from "./auth.message.js";
import { generatePasswordResetSuccessEmail, generateResetPasswordEmail } from "./auth.view.js";

export const registerSevice = async (dataRegister) => {
	const { email, password, fullname, role } = dataRegister;

	//* 1. Kiểm tra email người dùng đã đăng ký chưa?
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return throwError(400, MESSAGES.EMAIL_ALREADY_EXISTS);
	}

	//* 2. Mã hoá mật khẩu
	const passwordHash = await hashPassword(password);

	//* 3. Tạo ra username dựa vào fullname của người dùng
	// Generate username
	const username = await generateUsername(fullname);

	//* 4. Tạo ra studentId nếu role = student
	let studentId = await generateStudentId();

	//* 5. Create new user
	// Tương lai có thể bổ sung thêm tính năng ngăn chặn người dùng tự đặt role của mình là superadmin
	const newUser = await User.create({
		...dataRegister,
		password: passwordHash,
		username,
		studentId,
	});

	newUser.password = undefined;
	return newUser;
};

export const loginService = async (dataLogin) => {
	const { email, password } = dataLogin;

	const user = await User.findOne({ email });
	if (!user) throwError(401, MESSAGES.USER_NOT_FOUND);

	const isMatch = comparePassword(password, user.password);
	if (!isMatch) throwError(401, MESSAGES.INVALID_PASSWORD);

	const accessToken = signToken({ id: user._id }, "1d");
	const refreshToken = signToken({ id: user._id }, "30d");

	user.password = undefined;

	return {
		user,
		accessToken,
		refreshToken,
	};
};

export const refreshTokenService = async (refreshToken) => {
	console.log(refreshToken);
	if (!refreshToken) throwError(401, MESSAGES.INVALID_REFRESH_TOKEN);

	const { valid, decoded } = verifyToken(refreshToken);
	if (valid) {
		const accessToken = signToken({ id: decoded.id }, "1d");
		const newRefreshToken = signToken({ id: decoded.id }, "30d");
		return { accessToken, refreshToken: newRefreshToken };
	}
};

export const fotgotPasswordService = async (email) => {
	const user = await User.findOne({ email });
	if (!user) throwError(404, MESSAGES.USER_NOT_FOUND);

	
	const resetToken = signToken({ id: user._id, role: user.role }, RESET_PASSWORD_EXPIRES || "15m");

	const resetLink = `${FRONTEND_URL}/auth/reset-password/${resetToken}`;
	const subject = "[CodeFarm] Đặt lại mật khẩu cho tài khoản của bạn";
	const html = generateResetPasswordEmail(resetLink, RESET_PASSWORD_EXPIRES || "15 phút");
	await sendEmail(email, subject, { html });
	return true;
};

export const resetPasswordService = async (resetToken, newPassword) => {
	const decoded = verifyToken(resetToken);
	const user = await User.findById(decoded.decoded.id);
	if (!user) throwError(400, MESSAGES.USER_NOT_FOUND);
	user.password = await hashPassword(newPassword);

	await user.save();
	const subject = "Mật khẩu đã được đặt lại";
	const html = generatePasswordResetSuccessEmail();
	await sendEmail(user.email, subject, { html });

	return true;
};