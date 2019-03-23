const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create university schema
const UniversitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  foundingYear: {
    type: Number
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

module.exports = university = mongoose.model("university", UniversitySchema);
