import Router from "express";
import { restrictTo, verifyUser } from "../../common/middlewares/auth.middlewares.js";
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js";
import * as userController from "./user.controller.js";
import { blockUserSchema, createUserSchema, updateProfileSchema, updateRoleSchema } from "./user.schema.js";

const userRoutes = Router();

userRoutes.use(verifyUser);
userRoutes.get("/profile/me", userController.getProfileController);
userRoutes.patch("/profile/update", validBodyRequest(updateProfileSchema), userController.updateProfileController);
userRoutes.use(restrictTo(["superAdmin"]));
userRoutes.post("/", validBodyRequest(createUserSchema), userController.createUser);
userRoutes.get("/:userId", userController.getUser);
userRoutes.get("/", userController.getAllUsersController);
userRoutes.patch("/role/:userId", validBodyRequest(updateRoleSchema), userController.updateRole);
userRoutes.patch("/block/:userId", validBodyRequest(blockUserSchema), userController.blockUserController);


export default userRoutes;