import * as subjectService from "./subject.service.js"
import handleAsync from "../../common/utils/async-handler.js"
import { createError } from "../../common/utils/create-error.js"
import { createResponse } from "../../common/utils/create-response.js";
import MESSAGES from "./subject.message.js";

export const createSubject = handleAsync(async (req, res) => {
    const subject = await subjectService.createSubject(req.body);
    return createResponse(res, 201, MESSAGES.CREATED_SUCCESS, subject);
})

export const getAllSubjects = handleAsync(async (req, res) => {
	const subjects = await subjectService.getAllSubject(req.query);
	return createResponse(res, 200, MESSAGES.GET_SUCCESS, subjects.data, subjects.meta);
});


export const getSubjectById = handleAsync(async (req, res) => {
	const subject = await subjectService.getSubjectById(req.params.id);
	if (!subject) {
		throw createError(404, MESSAGES.NOT_FOUND);
	}
	return createResponse(res, 200, MESSAGES.GET_BY_ID_SUCCESS, subject);
});


export const updateSubject = handleAsync(async (req, res) => {
	const subject = await subjectService.updateSubject(req.params.id, req.body);
	if (!subject) {
		throw createError(404, MESSAGES.NOT_FOUND);
	}
	return createResponse(res, 200, MESSAGES.UPDATED_SUCCESS, subject);
});


export const softDeleteSubject = handleAsync(async (req, res) => {
	const subject = await subjectService.softDeleteSubject(req.params.id);
	if (!subject) {
		throw createError(404, MESSAGES.NOT_FOUND);
	}
	return createResponse(res, 200, MESSAGES.SOFT_DELETED_SUCCESS, subject);
});


export const restoreSubject = handleAsync(async (req, res) => {
	const subject = await subjectService.restoreSubject(req.params.id);
	if (!subject) {
		throw createError(404, MESSAGES.NOT_FOUND);
	}
	return createResponse(res, 200, MESSAGES.RESTORED_SUCCESS, subject);
});

export const deleteSubject = handleAsync(async (req, res) => {
	const subject = await subjectService.deleteSubject(req.params.id);
	if (!subject) {
		throw createError(404, MESSAGES.NOT_FOUND);
	}
	return createResponse(res, 200, MESSAGES.DELETED_SUCCESS, subject);
});