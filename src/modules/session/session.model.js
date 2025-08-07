import mongoose from "mongoose";

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
    note: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
    versionKey: false,
    indexes: [{ key: { classId: 1 } }, { key: { sessionDate: 1 } }],
  },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;