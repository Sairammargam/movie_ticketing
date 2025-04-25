import { v4 as uuidv4 } from 'uuid';
import { addDays, addHours, format } from 'date-fns';
import { Showtime } from '../types/showtime';
import { Seat } from '../types/seat';

// Mock theaters
const THEATERS = [
  {
    id: 't1',
    name: 'Century 16',
    location: '125 Main Street, Downtown',
  },
  {
    id: 't2',
    name: 'AMC Theaters',
    location: '789 Plaza Ave, Westside Mall',
  },
  {
    id: 't3',
    name: 'Regal Cinemas',
    location: '456 Oak Drive, Eastside',
  },
];

// Generate seat layout for a theater
const generateSeats = (showtimeId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seatsPerRow = 12;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    for (let j = 1; j <= seatsPerRow; j++) {
      // Skip some seats to create a realistic layout
      if ((row === 'E' && (j === 1 || j === seatsPerRow)) || 
          (row === 'F' && (j === 1 || j === seatsPerRow))) {
        continue;
      }
      
      // Randomly mark some seats as booked or VIP
      const randomNum = Math.random();
      let status: 'available' | 'booked' | 'reserved' = 'available';
      let type: 'regular' | 'vip' | 'handicap' = 'regular';
      
      if (randomNum < 0.2) {
        status = 'booked';
      }
      
      if (row === 'J' || row === 'K') {
        type = 'vip';
      }
      
      if (row === 'A' && (j === 1 || j === 2)) {
        type = 'handicap';
      }
      
      seats.push({
        id: uuidv4(),
        row,
        column: j,
        number: j,
        status,
        type,
      });
    }
  }
  
  return seats;
};

// Generate showtimes for a movie
const generateShowtimes = (movieId: string): Showtime[] => {
  const showtimes: Showtime[] = [];
  const today = new Date();
  
  // Create showtimes for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Each theater has 3-4 showtimes per day
    THEATERS.forEach(theater => {
      const numShowtimes = Math.floor(Math.random() * 2) + 3; // 3-4 showtimes
      
      for (let i = 0; i < numShowtimes; i++) {
        // Start times between 10 AM and 10 PM
        const startHour = 10 + (i * 3) + Math.floor(Math.random() * 2); // Add some randomness
        const startTime = addHours(date, startHour);
        const startTimeString = startTime.toISOString();
        
        // End time is 2 hours after start time (approx movie length)
        const endTime = addHours(startTime, 2);
        const endTimeString = endTime.toISOString();
        
        const showtimeId = uuidv4();
        
        showtimes.push({
          id: showtimeId,
          movieId,
          date: dateString,
          startTime: startTimeString,
          endTime: endTimeString,
          theater,
          seats: generateSeats(showtimeId),
        });
      }
    });
  }
  
  return showtimes;
};

// Mock showtimes cache
const MOCK_SHOWTIMES: Record<string, Showtime[]> = {};

export const getShowtimesByMovieId = async (movieId: string): Promise<Showtime[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate showtimes if they don't exist
  if (!MOCK_SHOWTIMES[movieId]) {
    MOCK_SHOWTIMES[movieId] = generateShowtimes(movieId);
  }
  
  return MOCK_SHOWTIMES[movieId];
};

export const getShowtimeById = async (showtimeId: string): Promise<Showtime> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Search for the showtime in all movies
  for (const movieId in MOCK_SHOWTIMES) {
    const showtime = MOCK_SHOWTIMES[movieId].find(s => s.id === showtimeId);
    if (showtime) {
      return showtime;
    }
  }
  
  throw new Error(`Showtime with ID ${showtimeId} not found`);
};