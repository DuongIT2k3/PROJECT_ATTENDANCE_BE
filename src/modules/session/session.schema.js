import {z} from "zod";
export const createSessionSchema = z.object({
    classId: z.string().min(1, "ID lớp học là bắt buộc"),
    sessionDate: z.date({
        required_error: "Ngày buổi học là bắt buộc",
        invalid_type_error: "Ngày buổi học phải là một ngày hợp lệ",
    }),
    note: z.string().optional(),
})
.strict();

export const updateSessionSchema = z.object({
    classId: z.string().min(1, "ID lớp học là bắt buộc").optional(),
    sessionDate: z.date({
        required_error: "Ngày buổi học là bắt buộc",
        invalid_type_error: "Ngày buổi học phải là một ngày hợp lệ",
    })
    .optional(),
    note: z.string().optional(),
})
.strict()
.refine((data) => Object.keys(data).length > 0, {
    message: "Phải cung cấp ít nhất một trường để cập nhật",
});