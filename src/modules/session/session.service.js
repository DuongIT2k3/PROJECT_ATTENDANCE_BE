import Session from "./session.model.js"
import Class from "../class/class.model.js"
import Attendance from "../attendance/attendance.model.js"

export const createSession = async (data) => {
    const session = await Session.create(data);
    return session;
}

export const getAllSessionByClassId = async (classId) => {
    const session = await Session.find({classId}).sort({sessionDate: 1});
    return session;
}

export const getAllSessionByClassIdWithoutAttendance = async (classId) => {
    // Lấy tất cả sessions của class
    const sessions = await Session.find({classId}).sort({sessionDate: 1});
    
    // Lấy tất cả sessionIds đã có điểm danh
    const attendedSessionIds = await Attendance.distinct('sessionId', {
        sessionId: { $in: sessions.map(s => s._id) },
        deletedAt: null
    });
    
    // Lọc ra những sessions chưa có điểm danh
    const sessionsWithoutAttendance = sessions.filter(
        session => !attendedSessionIds.some(id => id.toString() === session._id.toString())
    );
    
    return sessionsWithoutAttendance;
}

export const getAllSessionsByStudentId = async (studentId) => {
    // Tìm tất cả các class mà học sinh tham gia
    const classes = await Class.find({
        studentIds: { $in: [studentId] },
        deletedAt: null
    }).select('_id');
    
    const classIds = classes.map(cls => cls._id);
    
    // Tìm tất cả session của các class đó
    const sessions = await Session.find({
        classId: { $in: classIds }
    }).populate({
        path: "classId",
        select: "name subjectId teacherId shift room daysOfWeek",
        populate: [
            { path: "subjectId", select: "name" },
            { path: "teacherId", select: "fullname" }
        ]
    }).sort({sessionDate: 1});
    
    return sessions;
}

export const getSessionById = async (id) => {
    const session = await Session.findById(id).populate({
        path: "classId",
        select: "name",
    });
    return session;
}

export const updateSessionById = async (id, data) => {
    const session = await Session.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate({
        path: "classId",
        select: "name",
    });
    return session;
};

export const deleteSessionById = async (id) => {
    const session = await Session.findByIdAndDelete(id, {new: true});
    return session;
};