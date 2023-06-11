const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const userSchema = Schema({
  id: {
    type: Number,
    uniqe: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "tutor"],
  },
  password: {
    type: String,
    required: true,
  },
  school_system: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  jwtToken: {
    type: String,
  },
  image: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema);
