import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, CalendarDays, Ticket } from 'lucide-react';
import { Movie } from '../../types/movie';

type HeroSliderProps = {
  movies: Movie[];
};

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  if (movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[80vh] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-40"
            style={{ backgroundImage: `url(${currentMovie.backdropUrl || currentMovie.posterUrl})` }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
          
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-white z-10">
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl md:text-5xl font-display font-bold mb-4"
                >
                  {currentMovie.title}
                </motion.h1>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4 mb-4"
                >
                  <div className="flex items-center bg-primary-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    <Star size={16} className="mr-1 text-accent-400" />
                    <span className="font-medium">{currentMovie.rating.toFixed(1)}/10</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="mr-1" />
                    <span>{currentMovie.duration} min</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <CalendarDays size={16} className="mr-1" />
                    <span>{new Date(currentMovie.releaseDate).getFullYear()}</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {currentMovie.genres.map((genre) => (
                    <span key={genre} className="bg-gray-800/80 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </motion.div>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-gray-300 mb-8 max-w-lg line-clamp-3 md:line-clamp-4"
                >
                  {currentMovie.description}
                </motion.p>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link 
                    to={`/movie/${currentMovie.id}`} 
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Ticket size={18} className="mr-2" />
                    Book Tickets
                  </Link>
                  <Link 
                    to={`/movie/${currentMovie.id}`} 
                    className="px-6 py-3 border border-gray-500 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block"
              >
                <div className="relative mx-auto w-3/4">
                  <img 
                    src={currentMovie.posterUrl} 
                    alt={currentMovie.title} 
                    className="rounded-lg shadow-2xl shadow-primary-500/20 border border-white/10"
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-5 -right-5 w-24 h-24 bg-primary-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-500/10 rounded-full blur-xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary-500' : 'bg-gray-500 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;