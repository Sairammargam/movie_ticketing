import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { getMovies } from '../services/movieService';
import { Movie } from '../types/movie';
import MovieCard from '../components/movies/MovieCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type FilterOptions = {
  genre: string;
  rating: number | null;
  releaseYear: string;
};

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [releaseYears, setReleaseYears] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterOptions>({
    genre: '',
    rating: null,
    releaseYear: '',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getMovies();
        
        // Extract unique genres and years
        const uniqueGenres = new Set<string>();
        const uniqueYears = new Set<string>();
        
        allMovies.forEach(movie => {
          movie.genres.forEach(genre => uniqueGenres.add(genre));
          uniqueYears.add(new Date(movie.releaseDate).getFullYear().toString());
        });
        
        setMovies(allMovies);
        setFilteredMovies(allMovies);
        setGenres(Array.from(uniqueGenres).sort());
        setReleaseYears(Array.from(uniqueYears).sort((a, b) => Number(b) - Number(a)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, movies]);

  const applyFilters = () => {
    let results = [...movies];
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (filters.genre) {
      results = results.filter(movie => 
        movie.genres.includes(filters.genre)
      );
    }
    
    // Apply rating filter
    if (filters.rating) {
      results = results.filter(movie => 
        movie.rating >= filters.rating
      );
    }
    
    // Apply year filter
    if (filters.releaseYear) {
      results = results.filter(movie => 
        new Date(movie.releaseDate).getFullYear().toString() === filters.releaseYear
      );
    }
    
    setFilteredMovies(results);
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      rating: null,
      releaseYear: '',
    });
    setSearchTerm('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Movies</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our collection of the latest blockbusters and timeless classics.
          </p>
        </div>
        
        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search movies by title or description..."
                className="w-full py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center space-x-2 py-3 px-6 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
          
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Filter Movies</h3>
                <button 
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Genre Filter */}
                <div>
                  <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    id="genre-filter"
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                {/* Rating Filter */}
                <div>
                  <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    id="rating-filter"
                    value={filters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="9">9+ Stars</option>
                    <option value="8">8+ Stars</option>
                    <option value="7">7+ Stars</option>
                    <option value="6">6+ Stars</option>
                    <option value="5">5+ Stars</option>
                    <option value="4">4+ Stars</option>
                  </select>
                </div>
                
                {/* Year Filter */}
                <div>
                  <label htmlFor="year-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>
                  <select
                    id="year-filter"
                    value={filters.releaseYear}
                    onChange={(e) => handleFilterChange('releaseYear', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Years</option>
                    {releaseYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-400">
            Showing <span className="text-white font-medium">{filteredMovies.length}</span> movies
          </p>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-gray-400 text-sm">Sort by:</label>
            <select
              id="sort"
              className="bg-gray-800 border border-gray-700 rounded-lg py-1 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popularity">Popularity</option>
              <option value="release-date">Release Date</option>
              <option value="rating">Rating</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
        
        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No movies found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;