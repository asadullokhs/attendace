const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  { 
    email: {
      type: String,
      required: true,
    },

    number:{
        type: String,
        required: true,
    },
    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },

    role: {
      type: String,
      required: true,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
