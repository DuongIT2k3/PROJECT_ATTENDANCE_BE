import mongoose from "mongoose";
import { queryBuilder } from "../../common/utils/query-builder.js";
import Class from "./class.model.js";
import Session from "../session/session.model.js";
import { createError } from "../../common/utils/create-error.js";
import { generateSessionDates, validateClassSchedule } from "./class.utils.js";

export const createClass = async (data) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { totalSessions, startDate, daysOfWeek } = data;
    if (!totalSessions || !startDate || !daysOfWeek) {
      throw createError(400, "Thiếu totalSessions, startDate, hoặc daysOfWeek");
    }

    // Xử lý daysOfWeek
    let datesOfWeek;
    if (typeof daysOfWeek === "string") {
      datesOfWeek = daysOfWeek.split(",").map(Number);
    } else if (Array.isArray(daysOfWeek)) {
      datesOfWeek = daysOfWeek.map(Number);
    } else {
      throw createError(400, "daysOfWeek must be a string or array");
    }

    // Tạo sessionDates
    const sessionDates = generateSessionDates(
      new Date(startDate),
      totalSessions,
      datesOfWeek
    );

    // Validate xung đột lịch học trước khi tạo
    const dataWithDates = { ...data, sessionDates };
    await validateClassSchedule(dataWithDates);

    const classInstance = await Class.create([data], { session });
    const createdClass = classInstance[0];

    const sessions = sessionDates.map((sessionDate) => ({
      classId: createdClass._id,
      sessionDate,
      note: "",
    }));
    await Session.insertMany(sessions, { session });

    await session.commitTransaction();
    session.endSession();

    return classInstance[0];
  } catch (error) {
    // console.log(error)
    await session.abortTransaction();
    session.endSession();
    throw createError(
      error.status || 500,
      error.message || "Failed to create class"
    );
  }
};
export const getAllClasses = async (query) => {
  const { includeDeleted = false, ...queryParams } = query;
  const data = await queryBuilder(
    Class,
    {
      ...queryParams,
      searchFields: ["name"],
    },
    {
      populate: [
        { path: "teacherId", select: "fullname" },
        { path: "subjectId", select: "name" },
        { path: "majorId", select: "name" },
      ],
    }
  );

  return data;
};

export const getClassById = async (id) => {
  return await Class.findOne({ _id: id, deletedAt: null }).populate([
    { path: "subjectId", select: "name" },
    { path: "majorId", select: "name" },
    { path: "teacherId", select: "fullname username" },
    { path: "studentIds", select: "fullname username email" }
  ]);
};

export const updateClass = async (id, data) => {
  await validateClassSchedule(data, id);
  
  return await Class.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: data },
    { new: true, runValidators: true }
  ).populate([
    { path: "subjectId", select: "name" },
    { path: "majorId", select: "name" },
    { path: "teacherId", select: "fullname username" },
    { path: "studentIds", select: "fullname username email" }
  ]);
};

export const softDeleteClass = async (id) => {
  return await Class.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  );
};

export const restoreClass = async (id) => {
  return await Class.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { $set: { deletedAt: null } },
    { new: true }
  ).populate([
    { path: "subjectId", select: "name" },
    { path: "majorId", select: "name" },
    { path: "teacherId", select: "fullname username" },
    { path: "studentIds", select: "fullname username email" }
  ]);
};

export const deleteClass = async (id) => {
  return await Class.findOneAndDelete(
    { _id: id },
    { new: true }
  );
};