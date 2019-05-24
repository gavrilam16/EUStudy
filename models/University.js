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
  address: {
    type: String
  },
  website: {
    type: String
  },
  foundingYear: {
    type: Number
  },
  motto: {
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
  THERanking: {
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
    duration: {
      type: String
    },
    ECTS: {
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
  admissionStartDate: {
    type: Date
  },
  admissionEndDate: {
    type: Date
  },
  subscribedUntil: {
    type: Date
  },
  enabled: {
    type: Boolean,
    required: true
  }
});

module.exports = university = mongoose.model("university", UniversitySchema);
