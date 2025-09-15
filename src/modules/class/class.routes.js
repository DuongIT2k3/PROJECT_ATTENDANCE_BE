import Router from "express";
import * as classController from "./class.controller.js";
import { createClassSchema, updateClassSchema } from "./class.schema.js";
import { verifyUser, restrictTo } from "../../common/middlewares/auth.middlewares.js";
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js";
import { RoleEnum } from "../../common/constants/enum.js";

const classRoutes = Router();

classRoutes.get("/", classController.getAllClasses);
classRoutes.get("/:id", classController.getClassById);

classRoutes.use(verifyUser);
classRoutes.use(restrictTo(RoleEnum.SUPER_ADMIN));
classRoutes.post("/", validBodyRequest(createClassSchema), classController.createClass);
classRoutes.patch("/:id", validBodyRequest(updateClassSchema),classController.updateClass);
classRoutes.patch("/soft-delete/:id",classController.softDeleteClass);
classRoutes.patch("/restore/:id", classController.restoreClass);
classRoutes.delete("/:id", classController.deleteClass);

export default classRoutes;