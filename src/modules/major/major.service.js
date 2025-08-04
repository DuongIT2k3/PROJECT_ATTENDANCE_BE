import { queryBuilder } from "../../common/utils/query-builder.js";
import Major from "./major.model.js";

// Create a new major
export const createMajor = async (data) => {
	const major = await Major.create(data);
	return major;
};

// Get all majors (with optional inclusion of soft-deleted records)
export const getAllMajors = async (query) => {
	const { includeDeleted = false, ...queryParams } = query;
	const data = await queryBuilder(Major, {
		...queryParams,
		includeDeleted: includeDeleted === "true",
		searchFields: ["name", "code", "description"],
	});
	return data;
};

// Get a major by ID
export const getMajorById = async (id) => {
	return await Major.findOne({ _id: id, deletedAt: null });
};

// Update a major
export const updateMajor = async (id, data) => {
	return await Major.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: data }, { new: true, runValidators: true });
};

// Soft delete a major
export const softDeleteMajor = async (id) => {
	return await Major.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: { deletedAt: new Date() } }, { new: true });
};

// Restore a soft-deleted major
export const restoreMajor = async (id) => {
	return await Major.findOneAndUpdate(
		{ _id: id, deletedAt: { $ne: null } },
		{ $set: { deletedAt: null } },
		{ new: true }
	);
};
export const deleteMajor = async (id) => {
	return await Major.findOneAndDelete({ _id: id, deletedAt: null});
};