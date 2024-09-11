// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema(
//   {
//     weekDay: {
//       required: true,
//       enum: ["odd, even"],
//     },
//     name:{
//       type: String,
//     },
//     students: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Group", groupSchema);

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
