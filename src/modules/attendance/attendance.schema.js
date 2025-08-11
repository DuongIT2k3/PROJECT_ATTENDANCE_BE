import { z } from "zod";
import { StatusEnum } from "../../common/constants/enum.js";

export const createAttendanceSchema = z.object({
  sessionId: z
    .string({ required_error: "sessionId is required" })
    .min(1, "sessionId is required"),
  attendances: z
    .array(
      z.object({
        studentId: z
          .string({ required_error: "studentId is required" })
          .min(1, "studentId is required"),
        status: z.enum(Object.values(StatusEnum), {
          required_error: "status is required",
          invalid_type_error: "status must be one of PRESENT, ABSENT, LATE",
        }),
        note: z.string().optional().default(""),
      }),
    )
    .min(1, "attendances must not be empty"),
});

export const updateAttendanceSchema = z.object({
  attendances: z
    .array(
      z.object({
        studentId: z
          .string({ required_error: "studentId is required" })
          .min(1, "studentId is required"),
        status: z
          .enum(Object.values(StatusEnum), {
            invalid_type_error: "status must be one of PRESENT, ABSENT, LATE",
          })
          .optional(),
        note: z.string().optional().default(""),
      }),
    )
    .min(1, "attendances must not be empty"),
});