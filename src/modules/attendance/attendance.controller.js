import { createResponse } from "../../common/utils/create-response.js";
import MESSAGES from "./attendance.message.js";
import * as attendanceService from "./attendance.service.js";
import handleAsync from "../../common/utils/async-handler.js"

export const createAttendance = handleAsync(async (req, res) => {
    const data = await attendanceService.createAttendance(req.body, req.user);
    return createResponse(res, 201, MESSAGES.CREATED_SUCCESS, data);
});

export const updateAttendance = handleAsync(async (req, res) => {
    const data = await attendanceService.updateAttendance(
        req.params.sessionId,
        req.body,
        req.user,
    );
    return createResponse(res, 200, MESSAGES.UPDATED_SUCCESS, data);
});

export const getAttendances = handleAsync(async (req, res) =>{
    const data = await attendanceService.getAttendances(req.query, req.user);
    return createResponse(res, 200, MESSAGES.GET_SUCCESS, data);
});

export const deleteAttendance = handleAsync(async(req, res) => {
    const data = await attendanceService.deleteAttendance(
        req.params.id,
        req.user,
    );
    return createResponse(res, 200, MESSAGES.DELETED_SUCCESS, data);
});

export const checkAttendanceStatus = handleAsync(async (req, res) => {
    const data = await attendanceService.checkAttendanceStatus(
        req.params.sessionId,
        req.user,
    );
    return createResponse(res, 200, "Kiểm tra trạng thái điểm danh thành công", data);
});

export const resetSessionAttendance = handleAsync(async (req, res) => {
    const data = await attendanceService.resetSessionAttendance(
        req.params.sessionId,
        req.user,
    );
    return createResponse(res, 200, "Reset điểm danh thành công", data);
});