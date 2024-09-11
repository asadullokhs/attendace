const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    weekDay: {
      required: true,
      enum: ["odd, even"],
    },
    students: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
