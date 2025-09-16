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

export const validateClassSchedule = async (
  classData,
  classIdToExclude = null
) => {
  const { name, teacherId, shift, room, studentIds } = classData;

  const excludeCondition = classIdToExclude
    ? { _id: { $ne: classIdToExclude } }
    : {};


  const existingClass = await Class.findOne({
    ...excludeCondition,
    $or: [

      { name: { $regex: `^${name.trim()}$`, $options: "i" } },

      // Cùng phòng và ca (trừ học online)
      {
        $and: [{ room: { $ne: "Online" } }, { room: room }, { shift: shift }],
      },
    ],
  });

  if (existingClass) {
    const isDuplicateName =
      existingClass.name.toLowerCase() === name.toLowerCase();
    const isRoomTimeConflict =
      existingClass.shift === shift &&
      existingClass.room === room &&
      room !== "Online";

    if (isDuplicateName) {
      throw createError(409, `Lớp học "${name}" đã được tạo trước đó`);
    }

    if (isRoomTimeConflict) {
      throw createError(
        409,
        `Phòng ${room} đã được sử dụng bởi lớp "${existingClass.name}" vào ca ${shift}`
      );
    }
  }

  // 2. Lấy danh sách ngày học - từ data hoặc query database nếu là update
  let classDates = classData.sessionDates || [];
  if (!classDates.length && classIdToExclude) {
    const existingSessions = await Session.find({
      classId: classIdToExclude,
    })
      .select("sessionDate")
      .lean();
    classDates = existingSessions.map((session) => session.sessionDate);
  }

  // 3. Kiểm tra xung đột giảng viên và học viên theo thời gian biểu
  if (shift && classDates.length > 0) {
    const [scheduleConflict] = await Session.aggregate([
      {
        // Lọc session theo ngày và loại trừ lớp đang cập nhật
        $match: {
          sessionDate: { $in: classDates },
          classId: { $ne: classIdToExclude },
        },
      },
      {
        // Backup classId gốc
        $addFields: { originalClassId: "$classId" },
      },
      {
        // Join với bảng classes
        $lookup: {
          from: "classes",
          localField: "originalClassId",
          foreignField: "_id",
          as: "classDetails",
        },
      },
      {
        // Convert array thành object
        $unwind: "$classDetails",
      },
      {
        // Chỉ lấy lớp có cùng ca học
        $match: { "classDetails.shift": shift },
      },
      {
        // Join với users để lấy thông tin học viên
        $lookup: {
          from: "users",
          let: { enrolledStudents: "$classDetails.studentIds" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$enrolledStudents"] } } },
            { $match: { role: "student" } },
            {
              $project: {
                _id: 1,
                username: 1,
                fullname: 1,
                studentId: 1,
              },
            },
          ],
          as: "enrolledStudents",
        },
      },
      // Sắp xếp và lấy 1 kết quả đầu tiên
      { $sort: { sessionDate: 1 } },
      { $limit: 1 },
      {
        // Cleanup: loại bỏ field không cần thiết
        $project: { originalClassId: 0 },
      },
    ]);

    if (!scheduleConflict?.classDetails) return;

    const conflictedClass = scheduleConflict.classDetails;
    const isSameTimeSlot = conflictedClass.shift === shift;

    // 3.1 Kiểm tra xung đột giảng viên
    if (teacherId && isSameTimeSlot) {
      const isTeacherBusy =
        conflictedClass.teacherId?.toString() === teacherId.toString();

      if (isTeacherBusy) {
        throw createError(
          409,
          `Giảng viên đã được phân công dạy lớp "${conflictedClass.name}" trong cùng thời gian này`
        );
      }
    }

    // 3.2 Kiểm tra xung đột học viên
    if (studentIds?.length && isSameTimeSlot) {
      const busyStudents = scheduleConflict.enrolledStudents.filter((student) =>
        studentIds.map(String).includes(student._id.toString())
      );

      if (busyStudents.length > 0) {
        const studentNames = busyStudents.map((student) => student.fullname);
        throw createError(
          409,
          `Học viên: ${studentNames.join(", ")} đã đăng ký lớp "${
            conflictedClass.name
          }" trong cùng thời gian này`
        );
      }
    }
  }
};
