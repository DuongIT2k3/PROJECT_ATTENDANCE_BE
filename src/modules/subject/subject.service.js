import { queryBuilder } from "../../common/utils/query-builder.js"
import subjectModel from "./subject.model.js"
import { generateSubjectCode } from "./subject.utils.js";

export const createSubject = async (data) => {
    const subject = await subjectModel.create({
        ...data,
        code: await generateSubjectCode(data.englishName),
    });
    return subject;
}

export const getAllSubject = async (query) => {
    const { includeDeleted = false, ...queryParams } = query;
	const data = await queryBuilder(subjectModel, {
		...queryParams,
		includeDeleted: includeDeleted === "true",
		searchFields: ["name", "code", "description", "englishName"],
	});
	return data;
};

export const getSubjectById = async (id) => {
    return await subjectModel.findOne({ _id: id, deletedAt: null});
};

export const updateSubject = async (id, data) => {
    return await subjectModel.findOneAndUpdate({ _id: id, deletedAt: null}, { $set: data }, { new: true, runValidators: true });
}

export const softDeleteSubject = async (id) => {
    return await subjectModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: { deletedAt: new Date() } }, { new: true });
};

export const restoreSubject = async (id) => {
    return await subjectModel.findOneAndUpdate(
		{ _id: id, deletedAt: { $ne: null } },
		{ $set: { deletedAt: null } },
		{ new: true }
	);
};

export const deleteSubject = async (id) => {
    return await subjectModel.findOneAndDelete({ _id: id, deletedAt: null});
}