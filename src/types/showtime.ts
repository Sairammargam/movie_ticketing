import { Seat } from './seat';

export type Showtime = {
  id: string;
  movieId: string;
  date: string;
  startTime: string;
  endTime: string;
  theater: {
    id: string;
    name: string;
    location: string;
  };
  seats: Seat[];
};