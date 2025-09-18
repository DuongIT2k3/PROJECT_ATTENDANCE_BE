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


const attendanceRoutes = Router();
attendanceRoutes.use(verifyUser);
attendanceRoutes.get("/", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT]), attendanceController.getAttendances);
attendanceRoutes.post("/", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), validBodyRequest(createAttendanceSchema), attendanceController.createAttendance);
attendanceRoutes.patch("/:sessionId", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), validBodyRequest(updateAttendanceSchema), attendanceController.updateAttendance);
attendanceRoutes.delete("/:id", restrictTo([RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]), attendanceController.deleteAttendance);

attendanceRoutes.get("/status/:sessionId", restrictTo([RoleEnum.SUPER_ADMIN,RoleEnum.TEACHER]), attendanceController.checkAttendanceStatus);
attendanceRoutes.delete("/reset/:sessionId", restrictTo([RoleEnum.SUPER_ADMIN]), attendanceController.resetSessionAttendance);

export default attendanceRoutes;