const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "not marked"],
      default: "not marked", // Default status
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);