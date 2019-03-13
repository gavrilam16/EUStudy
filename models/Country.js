const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create country schema
const CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  euMember: {
    type: Boolean,
    default: false
  },
  firstCycleFees: {
    type: Number,
    default: 0
  },
  secondCycleFees: {
    type: Number,
    default: 0
  },
  payingFees: {
    type: String
  },
  needBasedGrants: {
    type: Number,
    default: 0
  },
  meritBasedGrants: {
    type: Number,
    default: 0
  },
  receivingGrants: {
    type: String
  }
});

module.exports = Country = mongoose.model("country", CountrySchema);