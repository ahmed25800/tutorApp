const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const requestSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: String,
  },
  date: {
    type: Date,
  },
  state: {
    type: String,
    enum: ["pending", "accepted", "rejected", "canceled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  subject: {
    type: String,
  },
});
module.exports = mongoose.model("Request", requestSchema);
