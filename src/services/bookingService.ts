import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingRequest } from '../types/booking';
import { getMovieById } from './movieService';
import { getShowtimeById } from './showtimeService';

// Mock bookings
const MOCK_BOOKINGS: Booking[] = [];

// Generate a random booking reference
const generateBookingReference = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let reference = '';
  
  for (let i = 0; i < 8; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return reference;
};

export const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fetch movie and showtime details
  const movie = await getMovieById(bookingRequest.movieId);
  const showtime = await getShowtimeById(bookingRequest.showtimeId);
  
  // Get selected seats from showtime
  const selectedSeats = showtime.seats.filter(seat => 
    bookingRequest.seats.includes(seat.id)
  );
  
  // Create new booking
  const booking: Booking = {
    id: uuidv4(),
    reference: generateBookingReference(),
    movieId: bookingRequest.movieId,
    movie,
    showtimeId: bookingRequest.showtimeId,
    showtime,
    userId: bookingRequest.userId,
    seats: selectedSeats,
    totalAmount: bookingRequest.totalAmount,
    paymentMethod: bookingRequest.paymentMethod,
    bookingDate: bookingRequest.bookingDate,
    status: 'confirmed',
  };
  
  // Mark selected seats as booked in the showtime
  showtime.seats.forEach(seat => {
    if (bookingRequest.seats.includes(seat.id)) {
      seat.status = 'booked';
    }
  });
  
  // Save booking
  MOCK_BOOKINGS.push(booking);
  
  return booking;
};

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  
  if (!booking) {
    throw new Error(`Booking with ID ${bookingId} not found`);
  }
  
  return booking;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, if no bookings exist yet, create some sample bookings
  if (MOCK_BOOKINGS.length === 0) {
    await createSampleBookings(userId);
  }
  
  return MOCK_BOOKINGS.filter(b => b.userId === userId);
};

// Create sample bookings for demo purposes
const createSampleBookings = async (userId: string) => {
  // Sample movies
  const movieIds = ['1', '2', '3', '4'];
  
  for (const movieId of movieIds) {
    const movie = await getMovieById(movieId);
    const showtimes = await getShowtimeById(movieId);
    
    // Create a booking for each movie
    const showtime = showtimes;
    const seats = showtime.seats.filter(s => s.status === 'available').slice(0, 2);
    
    // Past booking date
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1);
    
    // Future booking date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    // Create past booking
    const pastBooking: Booking = {
      id: uuidv4(),
      reference: generateBookingReference(),
      movieId,
      movie,
      showtimeId: showtime.id,
      showtime,
      userId,
      seats,
      totalAmount: seats.length * 12.99 + 2,
      paymentMethod: 'credit_card',
      bookingDate: pastDate.toISOString(),
      status: 'confirmed',
    };
    
    // Create future booking
    const futureBooking: Booking = {
      id: uuidv4(),
      reference: generateBookingReference(),
      movieId,
      movie,
      showtimeId: showtime.id,
      showtime: {
        ...showtime,
        date: futureDate.toISOString(),
      },
      userId,
      seats,
      totalAmount: seats.length * 12.99 + 2,
      paymentMethod: 'credit_card',
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    };
    
    MOCK_BOOKINGS.push(pastBooking);
    MOCK_BOOKINGS.push(futureBooking);
  }
};