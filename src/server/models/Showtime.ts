import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  seats: [{
    row: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['regular', 'vip', 'handicap'],
      default: 'regular'
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'reserved'],
      default: 'available'
    }
  }]
});

export const Showtime = mongoose.model('Showtime', showtimeSchema);