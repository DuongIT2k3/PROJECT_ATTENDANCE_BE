import handleAsync from "../../common/utils/async-handler.js";
import { createError, throwError } from "../../common/utils/create-error.js";
import { createResponse } from "../../common/utils/create-response.js";
import MESSAGES from "../class/class.message.js";
import * as sessionService from "./session.service.js"

export const createSession = handleAsync(async (req, res) => {
    const session = await sessionService.createSession(req.body);
    if(!session) throwError(400, MESSAGES.CREATE_ERROR);
    return createResponse(res, 201, MESSAGES.CREATED_SUCCESS, session);
})
export const getAllSessionsByClassId = handleAsync(async(req, res) => {
    const sessions = await sessionService.getAllSessionByClassId(
        req.params.classId
    )
    return createResponse(res, 200, MESSAGES.GET_SUCCESS, sessions);
});

export const getAllSessionsByClassIdWithoutAttendance = handleAsync(async(req, res) => {
    const sessions = await sessionService.getAllSessionByClassIdWithoutAttendance(
        req.params.classId
    )
    return createResponse(res, 200, MESSAGES.GET_SUCCESS, sessions);
});

export const getSessionsByStudent = handleAsync(async(req, res) => {
    const studentId = req.user.id; // Lấy từ token đã verify
    const sessions = await sessionService.getAllSessionsByStudentId(studentId);
    return createResponse(res, 200, MESSAGES.GET_SUCCESS, sessions);
});

export const getSessionById = handleAsync(async (req, res) => {
    const session = await sessionService.getSessionById(req.params.id);
    if(!session) throwError(404, MESSAGES.NOT_FOUND);
    return createResponse(res, 200, MESSAGES.GET_BY_ID_SUCCESS, session);
});

export const updateSessionById = handleAsync(async (req, res) => {
    const session = await sessionService.updateSessionById(
        req.params.id,
        req.body,
    );
    if(!session) throwError(404, MESSAGES.NOT_FOUND);
    return createResponse(res, 200, MESSAGES.UPDATED_SUCCESS, session);
});

export const deleteSessionById = handleAsync(async (req, res) => {
    const session = await sessionService.deleteSessionById(req.params.id);
    if(!session) throwError(404, MESSAGES.NOT_FOUND);
    return createResponse(res, 200, MESSAGES.DELETED_SUCCESS, session);
});