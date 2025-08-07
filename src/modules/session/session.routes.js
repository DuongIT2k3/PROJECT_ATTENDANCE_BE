import Router from "express";
import { RoleEnum } from "../../common/constants/enum.js";
import * as sessionController from "./session.controller.js"
import { verifyUser, restrictTo } from "../../common/middlewares/auth.middlewares.js"
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js"
import { createSessionSchema, updateSessionSchema } from "./session.schema.js";

const sessionRoutes = Router();

sessionRoutes.get("/classid/:classId", sessionController.getAllSessionsByClassId);
sessionRoutes.get("/:id", sessionController.getSessionById);
sessionRoutes.use(verifyUser);
sessionRoutes.use(restrictTo(RoleEnum.SUPER_ADMIN));
sessionRoutes.post("/", validBodyRequest(createSessionSchema), sessionController.createSession);
sessionRoutes.patch("/:id",validBodyRequest(updateSessionSchema), sessionController.updateSessionById);
sessionRoutes.delete("/:id", sessionController.deleteSessionById);

export default sessionRoutes;