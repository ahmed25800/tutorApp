
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const studentSchema = Schema({
  grade: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

studentSchema.virtual("student_id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Student", studentSchema);
