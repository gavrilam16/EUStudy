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
  programs: [{
    name: {
      type: String
    },
    link: {
      type: String
    },
    domain: {
      type: String
    },
    degree: {
      type: String
    },
    fees: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    admissionRequests: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId
        },
        requestStatus: {
          type: String
        }
      }
    ],
  }],
  subscribedUntil: {
    type: Date
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

module.exports = university = mongoose.model("university", UniversitySchema);
