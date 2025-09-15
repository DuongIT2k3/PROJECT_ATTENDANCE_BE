import { z } from "zod";
import mongoose from "mongoose";
import { ShiftEnum } from "../../common/constants/enum.js";
import MESSAGES from "./class.message.js";


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createClassSchema = z
	.object({
		subjectId: z.string().refine(isValidObjectId, { message: "Invalid subjectId" }),
		majorId: z.string().refine(isValidObjectId, { message: "Invalid majorId" }),
		name: z.string().min(1, MESSAGES.NAME_REQUIRED),
		teacherId: z.string().refine(isValidObjectId, { message: "Invalid teacherId" }),
		studentIds: z.array(z.string().refine(isValidObjectId, { message: "Invalid studentId" })).optional(),
		startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: MESSAGES.INVALID_START_DATE,
		}),
		totalSessions: z.number().int().min(1, MESSAGES.INVALID_TOTAL_SESSIONS),
		shift: z.enum(Object.values(ShiftEnum), {
			errorMap: () => ({ message: MESSAGES.INVALID_SHIFT }),
		}),
		daysOfWeek: z.array(z.number()).transform((arr) => arr.join(',')),
		linkOnline: z.string().nullable().optional(),
		room: z.union([z.string(), z.array(z.string())]).transform((val) => 
			Array.isArray(val) ? val.join(', ') : val
		).optional(),
		deletedAt: z.date().optional().nullable(),
		description: z.string().optional(),
		maxStudents: z
			.number()
			.int()
			.min(1, "Số lượng sinh viên tối thiểu là 1")
			.max(100, "Số lượng sinh viên tối đa không được vượt quá 100")
			.optional(),
	})
	.strict();

export const updateClassSchema = z
	.object({
		subjectId: z.string().refine(isValidObjectId, { message: "Invalid subjectId" }).optional(),
		majorId: z.string().refine(isValidObjectId, { message: "Invalid majorId" }).optional(),
		name: z.string().min(1, MESSAGES.NAME_REQUIRED).optional(),
		teacherId: z.string().refine(isValidObjectId, { message: "Invalid teacherId" }).optional(),
		studentIds: z.array(z.string().refine(isValidObjectId, { message: "Invalid studentId" })).optional(),
		startDate: z
			.string()
			.refine((val) => !isNaN(Date.parse(val)), {
				message: MESSAGES.INVALID_START_DATE,
			})
			.optional(),
		totalSessions: z.number().int().min(1, MESSAGES.INVALID_TOTAL_SESSIONS).optional(),
		shift: z
			.enum(Object.values(ShiftEnum), {
				errorMap: () => ({ message: MESSAGES.INVALID_SHIFT }),
			})
			.optional(),
		daysOfWeek: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
		room: z.union([z.string(), z.array(z.string())]).transform((val) => 
			Array.isArray(val) ? val.join(', ') : val
		).optional(),
		description: z.string().optional(),
		maxStudents: z
			.number()
			.int()
			.min(1, "Số lượng sinh viên tối thiểu là 1")
			.max(100, "Số lượng sinh viên tối đa không được vượt quá 100")
			.optional(),
		linkOnline: z.string().nullable().optional(),
		deletedAt: z.date().optional().nullable(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: MESSAGES.UPDATE_REQUIRED,
	});