import { Movie } from './movie';
import { Showtime } from './showtime';
import { Seat } from './seat';

export type Booking = {
  id: string;
  reference: string;
  movieId: string;
  movie: Movie;
  showtimeId: string;
  showtime: Showtime;
  userId: string;
  seats: Seat[];
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
};

export type BookingRequest = {
  movieId: string;
  showtimeId: string;
  userId: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
};