import mongoose from "mongoose";
import { RoomEnum, ShiftEnum } from "../../common/constants/enum.js";

const classSchema = new mongoose.Schema(
	{
		subjectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject",
			required: true,
		},
		majorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Major",
			required: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		teacherId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		studentIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		startDate: {
			type: Date,
			required: true,
		},
		totalSessions: {
			type: Number,
			required: true,
			min: 1,
			max: 100,
			default: 100,
		},
		shift: {
			type: String,
			enum: Object.values(ShiftEnum),
			required: true,
		},
		daysOfWeek: {
			type: String,
			required: true,
		},
		room: {
			type: Object.values(RoomEnum),
			default: null,
		},
		description: {
			type: String,
			default: null,
		},
		linkOnline: {
			type: String,
			default: null,
		},
		maxStudents: {
			type: Number,
			min: 1,
			default: 100,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		indexes: [
			{ key: { name: 1 }, unique: true },
			{ key: { subjectId: 1 } },
			{ key: { teacherId: 1 } },
			{ key: { majorId: 1 } },
		],
	}
);

export default mongoose.model("Class", classSchema);