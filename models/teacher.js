const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const teacherSchema = Schema({
  state: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Subject",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    default: 2.5,
  },
  certificate: [
    {
      type: String,
    },
  ],
});
teacherSchema.virtual("teacher_id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Teacher", teacherSchema);
