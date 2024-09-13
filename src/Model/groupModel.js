
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    weekDay: {
      type: String,
      enum: ["odd, even"],
      required: true,
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
