const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create university schema
const UniversitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  foundingYear: {
    type: Number
  },
  website: {
    type: String
  },
  description: {
    type: String
  },
  firstCycleFees: {
    type: Number,
    default: 0
  },
  secondCycleFees: {
    type: Number,
    default: 0
  },
  subscriptionUntil: {
    type: Date
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

module.exports = university = mongoose.model("university", UniversitySchema);
