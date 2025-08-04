import Router from "express";
import * as subjectController from "./subject.controller.js";
import { restrictTo, verifyUser } from "../../common/middlewares/auth.middlewares.js";
import { RoleEnum } from "../../common/constants/enum.js";
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js";
import { createSubjectSchema } from "./subject.schema.js";
import { updateMajorSchema } from "../major/major.schema.js";

const subjectRoutes = Router();

subjectRoutes.get("/", subjectController.getAllSubjects);
subjectRoutes.get("/:id", subjectController.getSubjectById);

subjectRoutes.use(verifyUser);
subjectRoutes.use(restrictTo(RoleEnum.SUPER_ADMIN));
subjectRoutes.post("/", validBodyRequest(createSubjectSchema), subjectController.createSubject);
subjectRoutes.patch("/:id",validBodyRequest(updateMajorSchema),subjectController.updateSubject);
subjectRoutes.patch("/soft/:id", subjectController.softDeleteSubject);
subjectRoutes.patch("/restore/:id", subjectController.restoreSubject);
subjectRoutes.delete("/:id", subjectController.deleteSubject);

export default subjectRoutes;