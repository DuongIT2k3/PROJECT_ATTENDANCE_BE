import Router from "express";
import { forgotPassword, loginUser, refreshToken, registerUser, resetPassword } from "./auth.controller.js";
import { loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema.js";
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js";

const authRoutes = Router();

authRoutes.post("/register", validBodyRequest(registerSchema), registerUser);
authRoutes.post("/login", validBodyRequest(loginSchema), loginUser);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", validBodyRequest(resetPasswordSchema), resetPassword);

export default authRoutes;