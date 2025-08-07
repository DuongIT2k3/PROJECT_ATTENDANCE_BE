import Session from "./session.model.js"

export const createSession = async (data) => {
    const session = await Session.create(data);
    return session;
}

export const getAllSessionByClassId = async (classId) => {
    const session = await Session.find({classId}).sort({sessionDate: 1});
    return session;
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