import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  Heart, 
  Share2, 
  Play,
  Ticket,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { getMovieById } from '../services/movieService';
import { getShowtimesByMovieId } from '../services/showtimeService';
import { Movie } from '../types/movie';
import { Showtime } from '../types/showtime';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isShowtimesExpanded, setIsShowtimesExpanded] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Fetch movie details
        const movieData = await getMovieById(id);
        setMovie(movieData);
        
        // Fetch showtimes
        const showtimesData = await getShowtimesByMovieId(id);
        setShowtimes(showtimesData);
        
        // Set default selected date to today or first available
        const dates = [...new Set(showtimesData.map(s => format(new Date(s.date), 'yyyy-MM-dd')))];
        if (dates.length > 0) {
          const today = format(new Date(), 'yyyy-MM-dd');
          const todayAvailable = dates.includes(today);
          setSelectedDate(todayAvailable ? today : dates[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
        <p className="text-gray-400 mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/movies"
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  // Group showtimes by date
  const dateGroups = showtimes.reduce((groups, showtime) => {
    const date = format(new Date(showtime.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(showtime);
    return groups;
  }, {} as Record<string, Showtime[]>);

  // Get unique dates
  const availableDates = Object.keys(dateGroups).sort();

  // Filter showtimes for selected date
  const filteredShowtimes = selectedDate ? dateGroups[selectedDate] || [] : [];

  // Group filtered showtimes by theater
  const theaterGroups = filteredShowtimes.reduce((groups, showtime) => {
    if (!groups[showtime.theater.id]) {
      groups[showtime.theater.id] = {
        theater: showtime.theater,
        times: []
      };
    }
    groups[showtime.theater.id].times.push(showtime);
    return groups;
  }, {} as Record<string, { theater: { id: string; name: string; location: string }; times: Showtime[] }>);

  return (
    <>
      {/* Movie Hero */}
      <div className="relative pt-16">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm"
            style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/30"></div>
        </div>
        
        <div className="relative pt-20 pb-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Poster */}
            <div className="md:col-span-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto max-w-xs"
              >
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full rounded-lg shadow-xl border border-white/10 relative z-10"
                />
                <div className="absolute -bottom-3 -right-3 w-full h-full bg-primary-500/10 rounded-lg blur-xl -z-10"></div>
                <div className="absolute -top-3 -left-3 w-full h-full bg-accent-500/10 rounded-lg blur-xl -z-10"></div>
              </motion.div>
            </div>
            
            {/* Details */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-8 text-center md:text-left"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Star size={18} className="text-accent-500 mr-1" fill="currentColor" />
                  <span className="text-white font-medium">{movie.rating.toFixed(1)}/10</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Clock size={18} className="mr-1" />
                  <span>{movie.duration} min</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Calendar size={18} className="mr-1" />
                  <span>{format(new Date(movie.releaseDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-gray-800/80 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-8 max-w-3xl">
                {movie.description}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <button 
                  onClick={() => setIsTrailerOpen(true)}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center"
                >
                  <Play size={18} className="mr-2" />
                  Watch Trailer
                </button>
                
                <Link 
                  to={`#showtimes`}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Ticket size={18} className="mr-2" />
                  Book Tickets
                </Link>
                
                <button className="p-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors">
                  <Heart size={18} />
                </button>
                
                <button className="p-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
              
              <div className="border-t border-gray-800 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Director</h3>
                    <p className="text-white">{movie.director}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Writer</h3>
                    <p className="text-white">{movie.writer}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <h3 className="text-gray-400 text-sm mb-1">Cast</h3>
                    <p className="text-white">{movie.cast.join(', ')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Showtimes Section */}
      <section id="showtimes" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 text-center">
            Showtimes & Tickets
          </h2>
          
          {/* Date Selection */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {availableDates.map((date) => {
                const dateObj = new Date(date);
                const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                const isSelected = selectedDate === date;
                
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`min-w-20 px-4 py-3 rounded-lg flex flex-col items-center transition-colors ${
                      isSelected 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xs uppercase">{format(dateObj, 'EEE')}</span>
                    <span className="text-lg font-medium">{format(dateObj, 'd')}</span>
                    <span className="text-xs">{format(dateObj, 'MMM')}</span>
                    {isToday && (
                      <span className="text-xs mt-1 font-medium text-primary-300">TODAY</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Theaters and Showtimes */}
          {Object.values(theaterGroups).length > 0 ? (
            <div className="space-y-6">
              {Object.values(theaterGroups)
                .slice(0, isShowtimesExpanded ? undefined : 3)
                .map(({ theater, times }) => (
                  <div key={theater.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">{theater.name}</h3>
                      <p className="text-gray-400">{theater.location}</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-wrap gap-3">
                        {times
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                          .map((showtime) => (
                            <Link
                              key={showtime.id}
                              to={`/booking/${movie.id}/${showtime.id}`}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                            >
                              {format(new Date(showtime.startTime), 'h:mm a')}
                            </Link>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {Object.values(theaterGroups).length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setIsShowtimesExpanded(!isShowtimesExpanded)}
                    className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {isShowtimesExpanded ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Show less theaters
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        Show all {Object.values(theaterGroups).length} theaters
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Film size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-300 text-lg mb-2">No showtimes available for this date</p>
              <p className="text-gray-400">Please select a different date or check back later</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden w-full max-w-4xl">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerUrl}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Close trailer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetailsPage;