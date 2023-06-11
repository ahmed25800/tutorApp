const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const subjectSchema = Schema({
  subject_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
subjectSchema.virtual("subject_id").get(function () {
  return this._id.toHexString();
});
module.exports = mongoose.model("Subject", subjectSchema);
