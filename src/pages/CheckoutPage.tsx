import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronLeft, CreditCard, Clock, Info, CheckCircle, ArrowRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { Showtime } from '../types/showtime';
import { Seat } from '../types/seat';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../services/bookingService';

type CheckoutState = {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: Seat[];
  totalPrice: number;
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<CheckoutState | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    // Get data from location state
    if (location.state) {
      setState(location.state as CheckoutState);
    } else {
      // If no state, navigate back to movies
      navigate('/movies');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Countdown timer for checkout
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format the remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    
    if (!cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Use format MM/YY';
    }
    
    if (!cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value)) {
      const formatted = value
        .replace(/(.{4})/g, '$1 ')
        .trim();
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length > 2) {
        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiryDate(value);
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !state) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create booking
      const booking = await createBooking({
        movieId: state.movie.id,
        showtimeId: state.showtime.id,
        userId: user?.id || '',
        seats: state.selectedSeats.map(seat => seat.id),
        totalAmount: state.totalPrice + 2, // Including booking fee
        paymentMethod: 'credit_card',
        bookingDate: new Date().toISOString(),
      });
      
      setBookingId(booking.id);
      setIsPaymentComplete(true);
      
      // Navigate to confirmation page after a delay
      setTimeout(() => {
        navigate(`/confirmation/${booking.id}`);
      }, 3000);
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({
        payment: 'Failed to process payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state) {
    return null;
  }

  const { movie, showtime, selectedSeats, totalPrice } = state;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
              disabled={isProcessing || isPaymentComplete}
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>
            
            {timeLeft > 0 && !isPaymentComplete && (
              <div className="flex items-center text-warning-500">
                <Clock size={16} className="mr-1" />
                <span>Time remaining: {formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="col-span-2">
              {!isPaymentComplete ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h1 className="text-2xl font-display font-bold text-white mb-6">
                    Payment Details
                  </h1>
                  
                  {errors.payment && (
                    <div className="mb-6 p-4 bg-error-500/10 border border-error-500/30 text-error-400 rounded-lg">
                      {errors.payment}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          id="cardNumber"
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full py-3 px-4 bg-gray-700 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.cardNumber ? 'border-error-500' : 'border-gray-600'
                          }`}
                          disabled={isProcessing}
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-error-400 text-sm">{errors.cardNumber}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full py-3 px-4 bg-gray-700 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.cardName ? 'border-error-500' : 'border-gray-600'
                        }`}
                        disabled={isProcessing}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-error-400 text-sm">{errors.cardName}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full py-3 px-4 bg-gray-700 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.expiryDate ? 'border-error-500' : 'border-gray-600'
                          }`}
                          disabled={isProcessing}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-error-400 text-sm">{errors.expiryDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full py-3 px-4 bg-gray-700 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.cvv ? 'border-error-500' : 'border-gray-600'
                          }`}
                          disabled={isProcessing}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-error-400 text-sm">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-8">
                      <input
                        id="saveCard"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                        disabled={isProcessing}
                      />
                      <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-400">
                        Save this card for future purchases
                      </label>
                    </div>
                    
                    <div className="p-4 mb-6 bg-gray-700/30 rounded-lg flex items-start">
                      <Info size={18} className="text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-gray-300 text-sm">
                        <p className="mb-1">This is a simulated payment system. For testing, you can use:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          <li>Card Number: 4242 4242 4242 4242</li>
                          <li>Any future expiry date</li>
                          <li>Any 3 digits for CVV</li>
                        </ul>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 px-6 bg-primary-500 text-white rounded-lg disabled:opacity-70 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>Pay ${(totalPrice + 2).toFixed(2)}</>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-lg p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-success-500" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Payment Successful!</h2>
                  <p className="text-gray-300 mb-4">
                    Your booking has been confirmed. Redirecting you to the confirmation page...
                  </p>
                  <div className="flex justify-center mt-6">
                    <motion.div 
                      animate={{ 
                        x: [0, 10, 0], 
                        transition: { repeat: Infinity, duration: 1.5 } 
                      }}
                    >
                      <ArrowRight size={24} className="text-primary-500" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
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
                      {format(new Date(showtime.date), 'EEE, MMM d')} • {format(new Date(showtime.startTime), 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Selected Seats ({selectedSeats.length})</h3>
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
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
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
              
              {timeLeft <= 0 && !isPaymentComplete && (
                <div className="p-3 bg-warning-500/10 border border-warning-500/30 text-warning-400 rounded-md flex items-center">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Your reservation time has expired. Seats are no longer guaranteed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;