import {
	fotgotPasswordService,
	loginService,
	refreshTokenService,
	registerSevice,
	resetPasswordService,
} from "./auth.service.js";
import { createResponse } from "../../common/utils/create-response.js";
import MESSAGES from "./auth.message.js";
import handleAsync from "../../common/utils/async-handler.js";
import { createError } from "../../common/utils/create-error.js";

// @route   POST /api/auth/register
export const registerUser = handleAsync(async (req, res, next) => {
	const newUser = await registerSevice(req.body);
	return createResponse(res, 201, MESSAGES.REGISTER_SUCCESS, newUser);
});

export const loginUser = handleAsync(async (req, res, next) => {
	const data = await loginService(req.body);
	return createResponse(res, 200, MESSAGES.LOGIN_SUCCESS, data);
});

// * @route POST /api/auth/refresh-token
export const refreshToken = handleAsync(async (req, res, next) => {
	// Ưu tiên lấy refreshToken từ body, header, cookie
	const refreshToken = req.body?.refreshToken || req.headers["x-refresh-token"] || req.cookies.refreshToken;
	const data = await refreshTokenService(refreshToken);
	return createResponse(res, 200, MESSAGES.REFRESH_TOKEN_SUCCESS, data);
});

// @route   POST /api/auth/forgot-password
export const forgotPassword = handleAsync(async (req, res, next) => {
	const isSendMail = await fotgotPasswordService(req.body.email);
	if (!isSendMail) {
		return createError(400, MESSAGES.SEND_MAIL_FAIL);
	}
	return createResponse(res, 200, MESSAGES.SEND_SUCCESS);
});

export const resetPassword = handleAsync(async (req, res, next) => {
	const isResetPassword = await resetPasswordService(req.body.resetToken, req.body.newPassword);

	if (!isResetPassword) return res.status(400).json(createError(400, MESSAGES.PASSWORD_CHANGE_FAILED));

	return createResponse(res, 200, MESSAGES.PASSWORD_RESET_SUCCESS);
});