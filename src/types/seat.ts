export type SeatStatus = 'available' | 'booked' | 'reserved';
export type SeatType = 'regular' | 'vip' | 'handicap';

export type Seat = {
  id: string;
  row: string;
  column: number;
  number: number;
  status: SeatStatus;
  type: SeatType;
};