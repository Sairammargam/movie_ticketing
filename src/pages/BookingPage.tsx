import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, AlertCircle } from 'lucide-react';
import { getMovieById } from '../services/movieService';
import { getShowtimeById } from '../services/showtimeService';
import { Movie } from '../types/movie';
import { Showtime } from '../types/showtime';
import { Seat } from '../types/seat';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

type SeatMap = Record<string, Seat[][]>;

const BookingPage = () => {
  const { id, showtimeId } = useParams<{ id: string; showtimeId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !showtimeId) return;
      
      try {
        // Fetch movie details
        const movieData = await getMovieById(id);
        setMovie(movieData);
        
        // Fetch showtime details
        const showtimeData = await getShowtimeById(showtimeId);
        setShowtime(showtimeData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id, showtimeId]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;
    
    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);
    
    if (seatIndex === -1) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    }
  };

  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some(s => s.id === seat.id);
  };

  const seatPrice = 12.99; // Base price per seat

  const totalPrice = selectedSeats.length * seatPrice;

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    // Navigate to checkout with selected seats
    navigate('/checkout', { 
      state: { 
        movie, 
        showtime, 
        selectedSeats, 
        totalPrice
      } 
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie || !showtime) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
        <p className="text-gray-400 mb-8">The movie or showtime you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Create seat map from showtime seats
  const seatMap: SeatMap = showtime.seats.reduce((acc, seat) => {
    const { row, column } = seat;
    
    if (!acc[row]) {
      acc[row] = [];
    }
    
    if (!acc[row][column]) {
      acc[row][column] = [];
    }
    
    acc[row][column] = seat;
    return acc;
  }, {} as SeatMap);

  // Convert the seat map to a 2D array for rendering
  const rowNames = Object.keys(seatMap).sort();
  const seatGrid = rowNames.map(rowName => {
    const rowSeats = Object.values(seatMap[rowName]);
    return rowSeats;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 text-center">
            Select Your Seats
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {movie.title} • {new Date(showtime.date).toLocaleDateString()} • {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Selection */}
            <div className="col-span-2 bg-gray-800 rounded-lg p-6">
              {/* Legend */}
              <div className="flex justify-center space-x-6 mb-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-gray-600 mr-2"></div>
                  <span className="text-gray-400 text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-primary-500 mr-2"></div>
                  <span className="text-gray-400 text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-gray-800 border border-gray-700 mr-2"></div>
                  <span className="text-gray-400 text-sm">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-accent-500 mr-2"></div>
                  <span className="text-gray-400 text-sm">VIP</span>
                </div>
              </div>
              
              {/* Screen */}
              <div className="relative mb-10">
                <div className="h-8 bg-gray-700/30 rounded-t-full mx-auto w-3/4 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">SCREEN</span>
                </div>
                <div className="h-1 bg-primary-500/40 w-full"></div>
              </div>
              
              {/* Seating Layout */}
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div className="grid place-items-center gap-y-3">
                    {seatGrid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center">
                        <div className="w-6 text-center text-gray-400 font-medium mr-4">
                          {rowNames[rowIndex]}
                        </div>
                        <div className="flex space-x-2">
                          {row.map((seat, seatIndex) => {
                            if (!seat) return <div key={seatIndex} className="w-8 h-8"></div>;
                            
                            const isSelected = isSeatSelected(seat);
                            
                            // Determine seat appearance based on status and selection
                            let seatClass = '';
                            if (seat.status === 'booked') {
                              seatClass = 'bg-gray-800 border border-gray-700 cursor-not-allowed opacity-50';
                            } else if (seat.status === 'available') {
                              if (isSelected) {
                                seatClass = 'bg-primary-500 hover:bg-primary-600 cursor-pointer';
                              } else if (seat.type === 'vip') {
                                seatClass = 'bg-accent-500 hover:bg-accent-600 cursor-pointer';
                              } else {
                                seatClass = 'bg-gray-600 hover:bg-gray-500 cursor-pointer';
                              }
                            }
                            
                            return (
                              <button
                                key={seat.id}
                                onClick={() => toggleSeat(seat)}
                                disabled={seat.status !== 'available'}
                                className={`w-8 h-8 rounded-t-md text-white flex items-center justify-center text-xs transition-colors ${seatClass}`}
                                aria-label={`Seat ${seat.row}${seat.number}`}
                                title={`Seat ${seat.row}${seat.number} - ${seat.status}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                        </div>
                        <div className="w-6 text-center text-gray-400 font-medium ml-4">
                          {rowNames[rowIndex]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-700/30 rounded-lg flex items-center">
                <Info size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Click on a seat to select it. You can select multiple seats. VIP seats may have an additional charge.
                </p>
              </div>
            </div>
            
            {/* Booking Summary */}
            <div className="bg-gray-800 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-white mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-16 h-auto rounded mr-4"
                  />
                  <div>
                    <h3 className="text-white font-medium">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{showtime.theater.name}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(showtime.date).toLocaleDateString()} • {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Selected Seats ({selectedSeats.length})</h3>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <span 
                          key={seat.id} 
                          className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-md text-sm"
                        >
                          {seat.row}{seat.number}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No seats selected</p>
                  )}
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
                    <span className="text-white">${(selectedSeats.length * seatPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Booking Fee</span>
                    <span className="text-white">$2.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t border-gray-700">
                    <span className="text-white">Total</span>
                    <span className="text-primary-400">${(totalPrice + 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {selectedSeats.length === 0 && (
                <div className="p-3 mb-4 bg-gray-700/50 rounded-md flex items-center">
                  <AlertCircle size={16} className="text-warning-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">Please select at least one seat to continue</p>
                </div>
              )}
              
              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
              >
                Continue to Payment
              </button>
              
              <p className="text-gray-400 text-xs mt-4 text-center">
                By proceeding, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;