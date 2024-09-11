
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    weekDay: {
      type: String,
      enum: ["odd, even"],
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    students: {
      type: Array,
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
