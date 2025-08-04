import mongoose from "mongoose";
import { ShiftEnum } from "../../common/constants/enum.js";

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
    },
    shift: {
      type: String,
      enum: Object.values(ShiftEnum),
      required: true,
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
  },
);

export default mongoose.model("Class", classSchema);