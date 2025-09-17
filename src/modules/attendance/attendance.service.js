import Attendance from "./attendance.model.js";
import Session from "../session/session.model.js";
import Class from "../class/class.model.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import mongoose from "mongoose";
import MESSAGES from "./attendance.message.js";
import { throwError } from "../../common/utils/create-error.js";
import User from "../user/user.model.js";
import { RoleEnum, StatusEnum } from "../../common/constants/enum.js";

export const checkAttendanceStatus = async (sessionId, user) => {
  const sessionExists = await Session.findById(sessionId);
  !sessionExists && throwError(404, MESSAGES.SESSION_NOT_FOUND);

  const classInstance = await Class.findById(sessionExists.classId);
  !classInstance && throwError(404, MESSAGES.CLASS_NOT_FOUND);

  const checkTeacher =
    user.role === RoleEnum.TEACHER &&
    classInstance.teacherId.toString() === user._id.toString();
  !checkTeacher &&
    user.role !== RoleEnum.SUPER_ADMIN &&
    throwError(
      403,
      `Bạn không phải là giảng viên lớp này, cũng không phải ${RoleEnum.SUPER_ADMIN}`
    );

  const existingAttendances = await Attendance.find({
    sessionId,
    deletedAt: null,
  });
  return {
    hasAttendance: existingAttendances.length > 0,
    sessionId,
    classId: sessionExists.classId,
  };
};
const validateAttendanceData = async (
  sessionId,
  attendances,
  user,
  session
) => {
  // Kiểm tra session tồn tại
  const sessionExists = await Session.findById(sessionId).session(session);
  !sessionExists && throwError(404, MESSAGES.SESSION_NOT_FOUND);

  // Kiểm tra lớp học
  const classInstance = await Class.findById(sessionExists.classId).session(
    session
  );
  !classInstance && throwError(404, MESSAGES.CLASS_NOT_FOUND);

  // Kiểm tra quyền: teacher chỉ cập nhật điểm danh cho lớp mình phụ trách
  const checkTeacher =
    user.role === RoleEnum.TEACHER &&
    classInstance.teacherId.toString() === user._id.toString();
  !checkTeacher &&
    user.role !== RoleEnum.SUPER_ADMIN &&
    throwError(
      403,
      `Bạn không phải giảng viên lớp này, bạn cũng không phải ${RoleEnum.SUPER_ADMIN} nên không thể cập nhật điểm danh`
    );

  // Kiểm tra tất cả studentId trong attendances
  const studentIds = attendances.map((att) => att.studentId);
  const validStudents = await User.find({
    _id: { $in: studentIds },
    role: "student",
  }).session(session);
  validStudents.length !== studentIds.length &&
    throwError(
      400,
      "Một hoặc nhiều ID sinh viên không hợp lệ hoặc không phải là sinh viên"
    );

  const classStudentIds = classInstance.studentIds.map((id) => id.toString());
  !studentIds.every((id) => classStudentIds.includes(id)) &&
    throwError(400, "Một hoặc nhiều sinh viên không thuộc lớp này");

  return {
    sessionExists,
    classInstance,
    studentIds,
    classStudentIds,
    isValid: true,
  };
};

export const createAttendance = async (data, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sessionId, attendances } = data;

    const sessionExists = await Session.findById(sessionId).session(session);
    !sessionExists && throwError(404, MESSAGES.SESSION_NOT_FOUND);

    const classInstance = await Class.findById(sessionExists.classId).session(
      session
    );
    !classInstance && throwError(404, MESSAGES.CLASS_NOT_FOUND);

    const checkTeacher =
      user.role === RoleEnum.TEACHER &&
      classInstance.teacherId.toString() === user._id.toString();
    !checkTeacher &&
      user.role !== RoleEnum.SUPER_ADMIN &&
      throwError(
        403,
        `Bạn không phải là giảng viên, cũng không phải là ${RoleEnum.SUPER_ADMIN} không thể điểm danh`
      );
    const studentIds = attendances.map((att) => att.studentId);
    const validStudents = await User.find({
      _id: { $in: studentIds },
      role: "student",
    }).session(session);
    validStudents.length !== studentIds.length &&
      throwError(
        400,
        "Một hoặc nhiều ID sinh viên không hợp lệ hoặc không phải là sinh viên"
      );
    const classStudentIds = classInstance.studentIds.map((id) => id.toString());
    !studentIds.every((id) => classStudentIds.includes(id)) &&
      throwError(400, "Một hoặc nhiều sinh viên không thuộc lớp này");

    const existingAttendances = await Attendance.find({
      sessionId,
      studentId: { $in: classStudentIds },
      deletedAt: null,
    }).session(session);
    existingAttendances.length > 0 &&
      throwError(400, "Điểm danh đã tồn tại cho buổi học này");

    const attendanceMap = new Map(
      attendances.map((att) => [att.studentId, att])
    );
    const attendanceDocs = classInstance.studentIds.map((studentId) => {
      const att = attendanceMap.get(studentId.toString()) || {
        studentId: studentId.toString(),
        status: StatusEnum.ABSENT,
        note: "",
      };
      return {
        sessionId,
        studentId: att.studentId,
        status: att.status,
        note: att.note || "",
      };
    });

    const createdAttendances = await Attendance.insertMany(attendanceDocs, {
      session,
    });

    

    await session.commitTransaction();
    session.endSession();
    return createdAttendances;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throwError(
      error.status || 500,
      error.message || "failed to create attendance"
    );
  }
};

export const updateAttendance = async (sessionId, data, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { attendances } = data;

    const sessionExists = await Session.findById(sessionId).session(session);
    !sessionExists && throwError(400, MESSAGES.SESSION_NOT_FOUND);

    const classInstance = await Class.findById(sessionExists.classId).session(
      session
    );
    !classInstance && throwError(404, MESSAGES.CLASS_NOT_FOUND);

    const checkTeacher =
      user.role === RoleEnum.TEACHER &&
      classInstance.teacherId.toString() === user._id.toString();
    !checkTeacher &&
      user.role !== RoleEnum.SUPER_ADMIN &&
      throwError(
        403,
        `Bạn không phải giảng viên của lớp này, cũng không phải là ${RoleEnum.SUPER_ADMIN} nên không thể cập nhật điểm danh`
      );

    const studentIds = attendances.map((att) => att.studentId);
    const validStudents = await User.find({
      _id: { $in: studentIds },
      role: "student",
    }).session(session);
    validStudents.length !== studentIds.length &&
      throwError(
        400,
        "Một hoặc nhiều ID sinh viên không hợp lệ hoặc không phải là sinh viên"
      );

    const classStudentIds = classInstance.studentIds.map((id) => id.toString());
    !studentIds.every((id) => classStudentIds.includes(id)) &&
      throwError(400, "Một hoặc nhiều sinh viên không thuộc lớp này");

    const attendanceMap = new Map(
      attendances.map((att) => [att.studentId, att])
    );
    const updatePromises = classInstance.studentIds.map(async (studentId) => {
      const att = attendanceMap.get(studentId.toString());
      if (att) {
        const existingAttendance = await Attendance.findOne({
          sessionId,
          studentId,
          deletedAt: null,
        }).session(session);

        if (existingAttendance) {

          return Attendance.findOneAndUpdate(
            { sessionId, studentId, deletedAt: null },
            { status: att.status, note: att.note || "" },
            { new: true, session }
          );
        } else {

          const newAttendance = new Attendance({
            sessionId,
            studentId,
            status: att.status,
            note: att.note || "",
          });
          return newAttendance.save({ session });
        }
      }
      return null;
    });

    const updatedAttendances = (await Promise.all(updatePromises)).filter(
      (att) => att !== null
    );
    await session.commitTransaction();
    session.endSession();

    return updatedAttendances;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw throwError(
      error.status || 500,
      error.message || "Failed to update attendance"
    );
  }
};

export const getAttendances = async (query, user) => {
  const { sessionId, studentId, classId, startDate, endDate, ...queryParams } = query;
  const conditions = { deletedAt: null };

  user.role === RoleEnum.STUDENT && (conditions.studentId = user._id);

  if (user.role === RoleEnum.TEACHER) {
    const classes = await Class.find({ teacherId: user._id, deletedAt: null });
    const classIds = classes.map((c) => c._id);
    const sessions = await Session.find({
      classId: { $in: classIds },
      deletedAt: null,
    });
    conditions.sessionId = { $in: sessions.map((s) => s._id) };
  }

  sessionId && (conditions.sessionId = sessionId);
  studentId && (conditions.studentId = studentId);

  // Xử lý filter theo classId
  if (classId) {
    let sessionQuery = {
      classId: classId,
      deletedAt: null,
    };

    // Thêm filter theo ngày nếu có
    if (startDate || endDate) {
      sessionQuery.sessionDate = {};
      if (startDate) {
        sessionQuery.sessionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Thêm 1 ngày để include endDate
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        sessionQuery.sessionDate.$lt = endDatePlusOne;
      }
    }

    const sessions = await Session.find(sessionQuery);
    const sessionIds = sessions.map((s) => s._id);

    if (conditions.sessionId) {
      // Nếu đã có điều kiện sessionId từ teacher role, thì intersect
      const existingSessionIds = Array.isArray(conditions.sessionId.$in)
        ? conditions.sessionId.$in
        : [conditions.sessionId];
      conditions.sessionId = {
        $in: existingSessionIds.filter((id) =>
          sessionIds.some((sessionId) => sessionId.toString() === id.toString())
        ),
      };
    } else {
      conditions.sessionId = { $in: sessionIds };
    }
  }

  const data = await queryBuilder(
    Attendance,
    { ...queryParams, ...conditions },
    {
      populate: [
        { path: "sessionId", select: "sessionDate classId" },
        { path: "studentId", select: "fullname studentId" },
        { path: "sessionId.classId", select: " name subjectId teacherId " },
        { path: "sessionId.classId.subjectId", select: "name code" },
        { path: "sessionId.classId.teacherId", select: "fullname" },
      ],
    }
  );

  return data;
};

export const deleteAttendance = async (id, user) => {
  user.role !== RoleEnum.SUPER_ADMIN &&
    throwError(403, `Chỉ ${RoleEnum.SUPER_ADMIN} mới có thể xoá điểm danh`);

  const attendance = await Attendance.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  !attendance && throwError(404, "Điểm danh không tồn tại");

  return attendance;
};

// Thêm function mới để reset attendance của cả session
export const resetSessionAttendance = async (sessionId, user) => {
  user.role !== RoleEnum.SUPER_ADMIN &&
    throwError(403, `Chỉ ${RoleEnum.SUPER_ADMIN} mới có thể reset điểm danh`);

  // Kiểm tra session tồn tại
  const sessionExists = await Session.findById(sessionId);
  !sessionExists && throwError(404, "Session không tồn tại");

  // Soft delete tất cả attendance records của session này
  const result = await Attendance.updateMany(
    { sessionId, deletedAt: null },
    { deletedAt: new Date() }
  );

  return {
    sessionId,
    deletedCount: result.modifiedCount,
    message: `Đã reset điểm danh cho ${result.modifiedCount} sinh viên`
  };
};
