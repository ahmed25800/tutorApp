const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reportSchema = Schema({
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reason: {
    type: String,
  },
});
module.exports = mongoose.model("Report", reportSchema);
