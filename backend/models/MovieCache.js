const mongoose = require("mongoose");

const MovieCacheSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    source: {
      type: String,
      default: "tmdb"
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    expiresAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MovieCache", MovieCacheSchema);
