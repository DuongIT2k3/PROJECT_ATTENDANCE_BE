import { createError } from "../../common/utils/create-error.js";
import Class from "./class.model.js";
import Session from "../session/session.model.js";

export const generateSessionDates = (
  startDate,
  totalSessions,
  daysOfWeek = [1]
) => {
  if (!daysOfWeek || daysOfWeek.length === 0) {
    throw createError(400, "daysOfWeek is required and cannot be empty");
  }
  const sessionDates = [];
  let sessionCount = 0;
  let currentWeek = 0;

  while (sessionCount < totalSessions) {
    for (const day of daysOfWeek) {
      if (sessionCount >= totalSessions) break;
      const nextDate = new Date(startDate);
      nextDate.setDate(
        startDate.getDate() +
          ((day - startDate.getDay() + 7) % 7) +
          currentWeek * 7
      );
      sessionDates.push(nextDate);
      sessionCount++;
    }
    currentWeek++;
  }

  return sessionDates.sort((a, b) => a - b);
};

export const checkClassConflict = async (data, excludeId = null) => {
  const { name, teacherId, shift, studentIds, classId } = data;

  const baseCondition = excludeId ? { _id: { $ne: excludeId } } : {};

  // 1. Check trùng tên lớp hoặc trùng ca trong 1 phòng
  const conflict = await Class.findOne({
    ...baseCondition,
    $or: [
      // Trùng tên lớp
      { name: { $regex: `^${name.trim()}$`, $options: "i" } },

      // Trùng phòng + shift, nhưng loại trừ phòng "Online"
      {
        room: { $ne: "Online", $eq: data.room },
        shift: data.shift,
      },
    ],
  });

  if (conflict) {
    const isNameConflict =
      conflict.name.toLowerCase() === data.name.toLowerCase();
    const isRoomShiftConflict =
      conflict.shift === data.shift &&
      conflict.room.some((r) => r === data.room);

    if (isNameConflict) {
      throw createError(409, `Tên lớp ${data.name} đã tồn tại`);
    }

    if (isRoomShiftConflict) {
      throw createError(
        409,
        `Phòng ${data.room} đã có lớp ${conflict.name} trong ca ${data.shift}`,
      );
    }
  }

 
  let sessionDates = data.sessionDates || [];
  if (!sessionDates.length && excludeId) {
    const sessions = await Session.find({ classId: excludeId }).lean();
    sessionDates = sessions.map((s) => s.sessionDate);
  }
  // 3. Check trùng giảng viên và học viên trong 1 ca
  if (shift && sessionDates.length) {
    const [sessionConflict] = await Session.aggregate([
      {
        // 1) Lọc session theo ngày và loại trừ class đang update
        $match: {
          sessionDate: { $in: sessionDates },
          classId: { $ne: excludeId },
        },
      },
      {
        // 2) Lưu classId gốc sang biến tạm để dùng cho $lookup
        $set: { _classId: "$classId" },
      },
      {
        // 3) Lookup vào Classes và GHI ĐÈ field "classId" bằng object class
        $lookup: {
          from: "classes",
          localField: "_classId",
          foreignField: "_id",
          as: "classId", // <- giữ đúng tên 'classId' như khi populate
        },
      },
      {
        // 4) classId đang là mảng (kết quả lookup), convert thành object
        $unwind: "$classId",
      },
      {
        // 5) Chỉ giữ những lớp có shift trùng
        $match: { "classId.shift": shift },
      },
      {
        // 6) Lookup users có role = "student" và id nằm trong classId.studentIds
        $lookup: {
          from: "users", // collection users
          let: { studentIds: "$classId.studentIds" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$studentIds"] } } },
            { $match: { role: "student" } }, // chỉ lấy user có role student
            {
              $project: {
                _id: 1,
                username: 1,
                fullname: 1,
                studentId: 1,
              },
            },
          ],
          as: "classId.studentIds",
        },
      },
      // (Optional) Sắp xếp ưu tiên session gần nhất / cũ nhất rồi limit
      // { $sort: { sessionDate: 1 } },
      { $limit: 1 },
      {
        // 7) Dọn rác: bỏ biến tạm _classId nếu không cần
        $project: { _classId: 0 },
      },
    ]);
    if (!sessionConflict?.classId) return;
    const sessionClass = sessionConflict.classId;
    const sameShift = sessionClass.shift === shift;

    // 3.1 Check giảng viên
    const teacherConflict =
      teacherId &&
      sessionClass.teacherId?.toString() === teacherId.toString() &&
      sameShift;

    if (teacherConflict) {
      throw createError(
        409,
        `Giảng viên đã có lớp ${sessionClass.name} trong ca này`,
      );
    }

    // 3.2 Check học viên
    const studentConflict = studentIds?.length && sameShift;

    if (studentConflict) {
      const conflictedStudents = sessionClass.studentIds.filter((stu) =>
        studentIds.map(String).includes(stu._id.toString()),
      );

      if (conflictedStudents.length) {
        const codes = conflictedStudents.map((stu) => stu.fullname);
        throw createError(
          409,
          `Các học viên: ${codes.join(", ")} đã có lớp ${
            sessionClass.name
          } trong ca này`,
        );
      }
    }
  }
};