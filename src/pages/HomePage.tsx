import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Star, Clock, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { getMovies } from '../services/movieService';
import { Movie } from '../types/movie';
import MovieCard from '../components/movies/MovieCard';
import HeroSlider from '../components/home/HeroSlider';
import Testimonials from '../components/home/Testimonials';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getMovies();
        
        // Filter for featured (now playing) and upcoming movies
        const now = new Date();
        const featured = allMovies
          .filter(movie => new Date(movie.releaseDate) <= now)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        
        const upcoming = allMovies
          .filter(movie => new Date(movie.releaseDate) > now)
          .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
          .slice(0, 4);
        
        setFeaturedMovies(featured);
        setUpcomingMovies(upcoming);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pb-16">
      {/* Hero Slider */}
      <HeroSlider movies={featuredMovies.slice(0, 3)} />

      {/* Featured Movies */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
            Now Playing
          </h2>
          <Link 
            to="/movies" 
            className="flex items-center text-primary-500 hover:text-primary-400 transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {featuredMovies.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">
            Coming Soon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingMovies.map((movie) => (
              <Link 
                key={movie.id} 
                to={`/movie/${movie.id}`}
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-2 text-center md:hidden">
                      <span className="inline-flex items-center bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Calendar size={14} className="mr-1" />
                        {format(new Date(movie.releaseDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="hidden md:flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Calendar size={14} className="mr-1" />
                        {format(new Date(movie.releaseDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{movie.title}</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-400 mr-1" />
                        <span className="text-gray-400 text-sm">{movie.duration} min</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="text-accent-500 mr-1" />
                        <span className="text-gray-300 text-sm">{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">{movie.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.genres.map((genre) => (
                        <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-primary-500 inline-flex items-center group-hover:underline">
                        More info <ChevronRight size={16} />
                      </span>
                      <span className="inline-flex items-center text-gray-300 bg-gray-800 px-3 py-1 rounded-full text-sm">
                        <Ticket size={14} className="mr-1" />
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Promotional Banner */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-cinema-pattern bg-cover bg-center"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                Subscribe to Premium
              </h2>
              <p className="text-primary-100 mb-6">
                Get exclusive benefits including ticket discounts, free snacks, and early access to blockbuster releases.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-white">
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mr-2">✓</span>
                  Save 15% on all ticket purchases
                </li>
                <li className="flex items-center text-white">
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mr-2">✓</span>
                  Free medium popcorn with every ticket
                </li>
                <li className="flex items-center text-white">
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mr-2">✓</span>
                  Book tickets 48 hours before general release
                </li>
              </ul>
              <button className="px-6 py-3 bg-white text-primary-800 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Join Premium Now
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-primary-300 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-primary-500 rounded-full flex items-center justify-center shadow-neon">
                  <div className="text-center">
                    <span className="block text-white text-3xl md:text-4xl font-bold">$9.99</span>
                    <span className="block text-primary-100 text-sm">per month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;