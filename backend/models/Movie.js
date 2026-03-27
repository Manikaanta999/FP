const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  poster: {
    type: String,
    required: true
  },
  plot: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    required: true
  },
  detailsLink: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['Telugu', 'Hindi', 'English', 'Others'],
    index: true,
    required: true
  },
  age: {
    type: String,
    enum: ['All', 'U/A', '13+', '16+', '18+', 'A'],
    index: true,
    required: true
  },
  genre: {
    type: String,
    enum: ['Action', 'Romance', 'Comedy', 'Thriller/Crime'],
    index: true,
    required: true
  },
  ott: {
    type: String,
    enum: ['Hotstar', 'Netflix', 'Prime Video', 'Others'],
    index: true,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 7.5
  },
  year: {
    type: Number,
    default: 2024
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
