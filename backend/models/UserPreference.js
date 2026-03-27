const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    language: {
      type: String,
      default: "en"
    },
    ageRating: {
      type: String,
      default: "PG-13"
    },
    genres: {
      type: [String],
      default: []
    },
    ottPlatforms: {
      type: [String],
      default: []
    },
    watchlist: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
