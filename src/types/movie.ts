export type Movie = {
  id: string;
  title: string;
  description: string;
  director: string;
  writer: string;
  cast: string[];
  duration: number;
  rating: number;
  releaseDate: string;
  genres: string[];
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl: string;
  language: string;
};