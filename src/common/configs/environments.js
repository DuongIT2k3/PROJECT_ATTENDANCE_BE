import dotenv from "dotenv";

dotenv.config({});

export const {
	PORT,
	HOST,
	DB_URI,
	JWT_SECRET,
	JWT_EXPIRES_IN,
	NODE_ENV,
	EMAIL_USERNAME,
	EMAIL_PASSWORD,
	RESET_PASSWORD_SECRET,
	RESET_PASSWORD_EXPIRES,
	FRONTEND_URL,
} = process.env;