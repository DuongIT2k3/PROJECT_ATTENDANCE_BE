import Router from "express";
import { RoleEnum } from "../../common/constants/enum.js";
import {
    restrictTo, verifyUser
} from "../../common/middlewares/auth.middlewares.js"
import validBodyRequest from "../../common/middlewares/valid-body.middlewares.js";
import * as attendanceController from "./attendance.controller.js"
import {
    createAttendanceSchema,
    updateAttendanceSchema,
} from "./attendance.schema.js";


const attendaceRoutes = Router();
attendaceRoutes.use(verifyUser);
attendaceRoutes.get("/", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT]), attendanceController.getAttendances);
attendaceRoutes.post("/", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), validBodyRequest(createAttendanceSchema), attendanceController.createAttendance);
attendaceRoutes.patch("/:sessionId", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), validBodyRequest(updateAttendanceSchema), attendanceController.updateAttendance);
attendaceRoutes.delete("/:id", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), attendanceController.deleteAttendance);

attendaceRoutes.get("/status/:sessionId", restrictTo([RoleEnum.SUPER_ADMIN,RoleEnum.TEACHER]), attendanceController.checkAttendanceStatus);

export default attendaceRoutes;