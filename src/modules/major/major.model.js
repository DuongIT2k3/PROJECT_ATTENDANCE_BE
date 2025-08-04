import mongoose from "mongoose";

const majorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		indexes: [{ key: { code: 1 }, unique: true }],
	}
);

const Major = mongoose.model("Major", majorSchema);

export default Major;