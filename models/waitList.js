const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const WaitListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const WaitList = mongoose.model("WaitList", WaitListSchema);

module.exports = WaitList;
