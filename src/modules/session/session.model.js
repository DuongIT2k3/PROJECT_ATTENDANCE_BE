import mongoose from "mongoose";
import { RoomEnum, ShiftEnum } from "../../common/constants/enum.js";

const sessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    shift: {
      type: String,
      enum: Object.values(ShiftEnum),
      required: true,
    },
    room: {
      type: String,
      enum: Object.values(RoomEnum),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    indexes: [{ key: { classId: 1 } }, { key: { sessionDate: 1 } }],
  },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;