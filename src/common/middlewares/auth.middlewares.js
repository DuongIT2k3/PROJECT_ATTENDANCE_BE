import User from "../../modules/user/user.model.js";
import MESSAGES from "../../modules/auth/auth.message.js";
import { createError } from "../utils/create-error.js";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../configs/environments.js";

export const verifyUser = async (req, res, next) => {
	const authHeader = req.headers?.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(createError(401, MESSAGES.ACCESS_DENIED));
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return next(createError(401, "Token không được cung cấp"));
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		const user = await User.findById(decoded.id).select("role deletedAt isBlocked");
		if (!user || user.deletedAt) {
			return next(createError(401, "Tài khoản không tồn tại hoặc đã bị xóa"));
		}
		
		if (user.isBlocked) {
			return next(createError(403, MESSAGES.ACCOUNT_BLOCKED));
		}
		
		req.user = {
			id: decoded.id,
			role: user.role,
			_id: decoded.id,
		};
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return next(createError(401, "Token đã hết hạn"));
		}
		if (error.name === "JsonWebTokenError") {
			return next(createError(401, "Token không hợp lệ"));
		}
		return next(createError(401, MESSAGES.INVALID_TOKEN));
	}
};

export const restrictTo = (allowedRoles) => (req, res, next) => {
	const userRole = req.user?.role;
	if (!userRole) {
		return next(createError(401, MESSAGES.NOT_AUTHENTICATED));
	}

	if (!allowedRoles.includes(userRole)) {
		return next(createError(403, MESSAGES.FORBIDDEN));
	}
	next();
};