import mongoose from "mongoose";
import { StatusEnum } from "../../common/constants/enum.js";

const attendanceSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    deletedAt: {
      type: Date,
      default : null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    indexes: [{ key: { sessionId: 1 } }, { key: { studentId: 1 } }],
  },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;