import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  Ticket, 
  Info, 
  Calendar, 
  MapPin, 
  Clock, 
  User,
  Download,
  Share2,
  Home
} from 'lucide-react';
import { getBookingById } from '../services/bookingService';
import { Booking } from '../types/booking';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      try {
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
        <p className="text-gray-400 mb-8">We couldn't find the booking you're looking for.</p>
        <Link
          to="/profile"
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-success-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-400">
                Your tickets for <span className="text-white">{booking.movie.title}</span> have been booked successfully.
              </p>
            </div>
            
            {/* Booking Reference */}
            <div className="bg-gray-800 rounded-lg p-6 text-center mb-8">
              <div className="inline-flex items-center justify-center bg-gray-700 rounded-lg px-4 py-2 mb-2">
                <Ticket size={18} className="text-primary-500 mr-2" />
                <span className="text-white font-medium">Booking Reference</span>
              </div>
              <div className="text-2xl md:text-3xl font-mono text-white tracking-wider my-2">
                {booking.reference}
              </div>
              <p className="text-gray-400 text-sm">
                Please show this code at the theater to collect your tickets
              </p>
            </div>
            
            {/* Ticket Details */}
            <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-display font-semibold text-white mb-1">
                  Movie Details
                </h2>
                <p className="text-gray-400">
                  Here are the details of your booking
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img 
                      src={booking.movie.posterUrl} 
                      alt={booking.movie.title}
                      className="w-full rounded-lg shadow-lg border border-gray-700"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-2xl font-display font-semibold text-white mb-2">
                        {booking.movie.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {booking.movie.genres.map((genre) => (
                          <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm">
                        Duration: {booking.movie.duration} minutes
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Calendar size={18} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Date & Time</h4>
                          <p className="text-gray-400">
                            {format(new Date(booking.showtime.date), 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-gray-400">
                            {format(new Date(booking.showtime.startTime), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin size={18} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Theater</h4>
                          <p className="text-gray-400">{booking.showtime.theater.name}</p>
                          <p className="text-gray-400">{booking.showtime.theater.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Ticket size={18} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Seats</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {booking.seats.map((seat) => (
                              <span 
                                key={seat.id} 
                                className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-md text-sm"
                              >
                                {seat.row}{seat.number}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <User size={18} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Customer</h4>
                          <p className="text-gray-400">{user?.name}</p>
                          <p className="text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Tickets ({booking.seats.length})</span>
                        <span className="text-white">${(booking.totalAmount - 2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Booking Fee</span>
                        <span className="text-white">$2.00</span>
                      </div>
                      <div className="flex justify-between items-center font-medium text-lg pt-2 border-t border-gray-700">
                        <span className="text-white">Total Paid</span>
                        <span className="text-primary-400">${booking.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Information Box */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Info size={20} className="text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-2">Important Information</h3>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li>• Please arrive at least 15 minutes before the show.</li>
                    <li>• Present your booking reference at the counter to collect your tickets.</li>
                    <li>• Outside food and beverages are not allowed in the theater.</li>
                    <li>• Keep your tickets safe; they will be checked at the entrance.</li>
                    <li>• Cancellation policy: Tickets can be cancelled up to 4 hours before showtime for a partial refund.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Download size={18} />
                <span>Download Tickets</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Share2 size={18} />
                <span>Share Booking</span>
              </button>
              
              <Link 
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Home size={18} />
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;