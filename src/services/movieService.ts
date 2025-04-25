import { Movie } from '../types/movie';

// Mock movie data
const MOCK_MOVIES: Movie[] = [
  // Hollywood Movies
  {
    id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    duration: 148,
    rating: 8.8,
    releaseDate: '2023-01-15',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    posterUrl: 'https://images.pexels.com/photos/4571219/pexels-photo-4571219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    backdropUrl: 'https://images.pexels.com/photos/3131971/pexels-photo-3131971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    trailerUrl: 'RjR71XpAu0I',
    language: 'English'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    writer: 'Jonathan Nolan, Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    duration: 152,
    rating: 9.0,
    releaseDate: '2022-12-10',
    genres: ['Action', 'Crime', 'Drama'],
    posterUrl: 'https://images.pexels.com/photos/6426515/pexels-photo-6426515.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    backdropUrl: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    trailerUrl: 'EXeTwQWrcwY',
    language: 'English'
  },
  // Bollywood Movies
  {
    id: '13',
    title: 'Pathaan',
    description: 'A RAW agent codenamed Pathaan makes a comeback after a hiatus to thwart a major terrorist attack on Indian soil.',
    director: 'Siddharth Anand',
    writer: 'Shridhar Raghavan',
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham', 'Dimple Kapadia'],
    duration: 146,
    rating: 8.5,
    releaseDate: '2023-01-25',
    genres: ['Action', 'Thriller'],
    posterUrl: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
    trailerUrl: 'vqu4z34wENw',
    language: 'Hindi'
  },
  {
    id: '14',
    title: 'RRR',
    description: 'A tale of two legendary revolutionaries and their journey far away from home.',
    director: 'S.S. Rajamouli',
    writer: 'V. Vijayendra Prasad',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
    duration: 182,
    rating: 9.2,
    releaseDate: '2023-03-24',
    genres: ['Action', 'Drama', 'Historical'],
    posterUrl: 'https://images.pexels.com/photos/2406450/pexels-photo-2406450.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/2406450/pexels-photo-2406450.jpeg',
    trailerUrl: 'f_vbAtFSEc0',
    language: 'Telugu'
  },
  // Tamil Cinema
  {
    id: '15',
    title: 'Jailer',
    description: 'A retired jailer goes on a manhunt to find his son\'s killers. But the road leads him to a familiar old enemy.',
    director: 'Nelson Dilipkumar',
    writer: 'Nelson Dilipkumar',
    cast: ['Rajinikanth', 'Mohanlal', 'Jackie Shroff', 'Shiva Rajkumar'],
    duration: 158,
    rating: 8.7,
    releaseDate: '2023-08-10',
    genres: ['Action', 'Drama', 'Thriller'],
    posterUrl: 'https://images.pexels.com/photos/2519225/pexels-photo-2519225.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/2519225/pexels-photo-2519225.jpeg',
    trailerUrl: 'Y6pCyDjTu8w',
    language: 'Tamil'
  },
  // Malayalam Cinema
  {
    id: '16',
    title: '2018',
    description: 'Based on the true events of the 2018 Kerala floods, the film follows the lives of various individuals affected by the disaster.',
    director: 'Jude Anthany Joseph',
    writer: 'Jude Anthany Joseph',
    cast: ['Tovino Thomas', 'Kunchacko Boban', 'Asif Ali'],
    duration: 146,
    rating: 8.8,
    releaseDate: '2023-05-05',
    genres: ['Drama', 'Thriller', 'Disaster'],
    posterUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    trailerUrl: 'q7CrZd4KyC4',
    language: 'Malayalam'
  },
  // Continuing with existing Hollywood movies...
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    director: 'Christopher Nolan',
    writer: 'Jonathan Nolan, Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    duration: 169,
    rating: 8.6,
    releaseDate: '2023-03-05',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    posterUrl: 'https://images.pexels.com/photos/5487669/pexels-photo-5487669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    backdropUrl: 'https://images.pexels.com/photos/4865035/pexels-photo-4865035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    trailerUrl: 'zSWdZVtXT7E',
    language: 'English'
  },
  // Rest of the existing movies...
  {
    id: '4',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    director: 'Quentin Tarantino',
    writer: 'Quentin Tarantino, Roger Avary',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    duration: 154,
    rating: 8.9,
    releaseDate: '2024-01-20',
    genres: ['Crime', 'Drama'],
    posterUrl: 'https://images.pexels.com/photos/1304469/pexels-photo-1304469.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    backdropUrl: 'https://images.pexels.com/photos/8088443/pexels-photo-8088443.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    trailerUrl: 's7EdQ4FqbhY',
    language: 'English'
  },
  {
    id: '5',
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    director: 'Lana Wachowski, Lilly Wachowski',
    writer: 'Lana Wachowski, Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
    duration: 136,
    rating: 8.7,
    releaseDate: '2023-02-25',
    genres: ['Action', 'Sci-Fi'],
    posterUrl: 'https://images.pexels.com/photos/7901014/pexels-photo-7901014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    backdropUrl: 'https://images.pexels.com/photos/1910225/pexels-photo-1910225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    trailerUrl: 'vKQi3bBA1y8',
    language: 'English'
  }
];

// Get user's location (simplified mock version)
const getUserLocation = (): string => {
  // In a real app, this would use the Geolocation API or IP-based location
  return 'India'; // Mocked to always return India for this example
};

export const getMovies = async (): Promise<Movie[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userLocation = getUserLocation();
  
  // If user is in India, prioritize Indian movies in the listing
  if (userLocation === 'India') {
    const indianMovies = MOCK_MOVIES.filter(movie => 
      ['Hindi', 'Tamil', 'Telugu', 'Malayalam'].includes(movie.language)
    );
    const hollywoodMovies = MOCK_MOVIES.filter(movie => 
      movie.language === 'English'
    );
    
    // Combine arrays with Indian movies first
    return [...indianMovies, ...hollywoodMovies];
  }
  
  return MOCK_MOVIES;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const movie = MOCK_MOVIES.find(movie => movie.id === id);
  
  if (!movie) {
    throw new Error(`Movie with ID ${id} not found`);
  }
  
  return movie;
};