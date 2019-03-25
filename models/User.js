const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create user schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  university: {
    type: String
  },
  role: {
    type: String,
    default: "none"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
