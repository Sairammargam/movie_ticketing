import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Movie } from '../../types/movie';

type MovieCardProps = {
  movie: Movie;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div 
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full transition-transform hover:shadow-card-hover"
        whileHover={{ y: -5 }}
      >
        <div className="relative">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full object-cover aspect-[2/3]"
          />
          
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white flex items-center py-1 px-2 rounded-full text-sm">
            <Star size={14} className="text-accent-500 mr-1" fill="currentColor" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium text-lg mb-1 line-clamp-1">{movie.title}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                {genre}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <button className="w-full py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
              Book Tickets
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;