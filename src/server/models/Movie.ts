import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  writer: {
    type: String,
    required: true
  },
  cast: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  posterUrl: {
    type: String,
    required: true
  },
  backdropUrl: {
    type: String
  },
  trailerUrl: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  }
});

export const Movie = mongoose.model('Movie', movieSchema);