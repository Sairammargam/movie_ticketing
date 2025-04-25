import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  User as UserIcon, 
  Ticket,
  Settings, 
  LogOut, 
  Edit,
  Bell,
  CreditCard,
  Film,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings } from '../services/bookingService';
import { Booking } from '../types/booking';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const bookingsData = await getUserBookings(user.id);
        
        // Sort bookings by date (newest first)
        bookingsData.sort((a, b) => 
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );
        
        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Filter bookings
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.showtime.date) >= new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    new Date(booking.showtime.date) < new Date()
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden border-4 border-primary-300">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={40} className="text-white" />
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-display font-bold text-white mb-1">
                    {user?.name}
                  </h1>
                  <p className="text-primary-200 mb-4">{user?.email}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <button className="flex items-center px-3 py-1.5 bg-gray-900/30 hover:bg-gray-900/50 text-white rounded-md transition-colors">
                      <Edit size={14} className="mr-1" />
                      Edit Profile
                    </button>
                    <button className="flex items-center px-3 py-1.5 bg-gray-900/30 hover:bg-gray-900/50 text-white rounded-md transition-colors">
                      <Settings size={14} className="mr-1" />
                      Settings
                    </button>
                    <button 
                      onClick={logout}
                      className="flex items-center px-3 py-1.5 bg-gray-900/30 hover:bg-gray-900/50 text-white rounded-md transition-colors"
                    >
                      <LogOut size={14} className="mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
                
                <div className="md:ml-auto flex flex-col items-center md:items-end mt-4 md:mt-0">
                  <div className="bg-primary-700 rounded-lg px-4 py-3 text-center md:text-right">
                    <h2 className="text-white font-medium mb-1">Premium Member</h2>
                    <p className="text-primary-200 text-sm">Valid until Dec 31, 2025</p>
                  </div>
                  <button className="mt-3 flex items-center text-primary-200 hover:text-white transition-colors">
                    <Bell size={14} className="mr-1" />
                    Manage Notifications
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'bookings' 
                    ? 'border-primary-500 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Ticket size={18} className="mr-2" />
                  My Bookings
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'preferences' 
                    ? 'border-primary-500 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Film size={18} className="mr-2" />
                  Preferences
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'payment' 
                    ? 'border-primary-500 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Payment Methods
                </span>
              </button>
            </div>
            
            {/* Tab Content */}
            <div>
              {activeTab === 'bookings' && (
                <div>
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <div>
                      {/* Upcoming Bookings */}
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">
                          Upcoming Bookings
                        </h2>
                        
                        {upcomingBookings.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                              <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800 rounded-lg overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                                  <div className="hidden md:block md:col-span-2 h-full">
                                    <img 
                                      src={booking.movie.posterUrl} 
                                      alt={booking.movie.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  
                                  <div className="p-5 md:col-span-8">
                                    <div className="flex items-center mb-1">
                                      <h3 className="text-lg font-medium text-white mr-2">
                                        {booking.movie.title}
                                      </h3>
                                      <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs">
                                        Upcoming
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center text-sm text-gray-400 gap-x-4 gap-y-1 mb-3">
                                      <div className="flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {format(new Date(booking.showtime.date), 'EEE, MMM d')} at {format(new Date(booking.showtime.startTime), 'h:mm a')}
                                      </div>
                                      <div>{booking.showtime.theater.name}</div>
                                      <div>
                                        Seats: {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center text-sm">
                                      <div className="px-2 py-1 bg-gray-700 rounded text-gray-300">
                                        Booking Ref: {booking.reference}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="md:col-span-2 p-4 md:p-5 flex md:justify-end border-t md:border-t-0 border-gray-700">
                                    <Link 
                                      to={`/confirmation/${booking.id}`}
                                      className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                      View Details
                                      <ChevronRight size={16} />
                                    </Link>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <Film size={40} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-gray-300 mb-4">You don't have any upcoming bookings</p>
                            <Link
                              to="/movies"
                              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors inline-block"
                            >
                              Browse Movies
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      {/* Past Bookings */}
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-4">
                          Past Bookings
                        </h2>
                        
                        {pastBookings.length > 0 ? (
                          <div className="space-y-4">
                            {pastBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-gray-800 rounded-lg overflow-hidden opacity-80"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                                  <div className="hidden md:block md:col-span-2 h-full">
                                    <img 
                                      src={booking.movie.posterUrl} 
                                      alt={booking.movie.title}
                                      className="h-full w-full object-cover filter grayscale"
                                    />
                                  </div>
                                  
                                  <div className="p-5 md:col-span-8">
                                    <div className="flex items-center mb-1">
                                      <h3 className="text-lg font-medium text-white mr-2">
                                        {booking.movie.title}
                                      </h3>
                                      <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                                        Completed
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center text-sm text-gray-400 gap-x-4 gap-y-1 mb-3">
                                      <div className="flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {format(new Date(booking.showtime.date), 'EEE, MMM d')} at {format(new Date(booking.showtime.startTime), 'h:mm a')}
                                      </div>
                                      <div>{booking.showtime.theater.name}</div>
                                      <div>
                                        Seats: {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center text-sm">
                                      <div className="px-2 py-1 bg-gray-700 rounded text-gray-300">
                                        Booking Ref: {booking.reference}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="md:col-span-2 p-4 md:p-5 flex md:justify-end border-t md:border-t-0 border-gray-700">
                                    <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                                      View Receipt
                                      <ChevronRight size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <p className="text-gray-400">No past bookings found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'preferences' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Movie Preferences</h2>
                  <p className="text-gray-400 mb-6">Set your movie preferences to get personalized recommendations</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Animation', 'Adventure', 'Fantasy', 'Romance'].map((genre) => (
                          <label key={genre} className="inline-flex items-center">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
                            />
                            <span className="ml-2 text-gray-300">{genre}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-3">Preferred Theaters</h3>
                      <div className="space-y-2">
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox"
                            checked
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
                          />
                          <span className="ml-2 text-gray-300">Century 16</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox"
                            checked
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
                          />
                          <span className="ml-2 text-gray-300">AMC Theaters</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
                          />
                          <span className="ml-2 text-gray-300">Regal Cinemas</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-gray-300">Email notifications for new releases</label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-1" className="sr-only" />
                            <label htmlFor="toggle-1" className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"></label>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="text-gray-300">Special offers and promotions</label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-2" className="sr-only" checked />
                            <label htmlFor="toggle-2" className="block overflow-hidden h-6 rounded-full bg-primary-500 cursor-pointer"></label>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="text-gray-300">Booking reminders</label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-3" className="sr-only" checked />
                            <label htmlFor="toggle-3" className="block overflow-hidden h-6 rounded-full bg-primary-500 cursor-pointer"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700 text-right">
                      <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'payment' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Payment Methods</h2>
                  <p className="text-gray-400 mb-6">Manage your saved payment methods for faster checkout</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                          <div>
                            <p className="text-white">•••• •••• •••• 4242</p>
                            <p className="text-gray-400 text-sm">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="mr-2 text-gray-400 hover:text-white">Edit</button>
                          <button className="text-gray-400 hover:text-white">Remove</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-red-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">MC</div>
                          <div>
                            <p className="text-white">•••• •••• •••• 5678</p>
                            <p className="text-gray-400 text-sm">Expires 08/26</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="mr-2 text-gray-400 hover:text-white">Edit</button>
                          <button className="text-gray-400 hover:text-white">Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                    <CreditCard size={18} className="mr-1" />
                    Add New Payment Method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;