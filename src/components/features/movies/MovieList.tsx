'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MovieCard from "@/components/features/movies/MovieCard";
import MovieCreateForm from './MovieCreateForm';
import { LoadedData } from '@/types/ssr';
import { Movie } from '@/types/database';

interface MovieListProps {
  movies: LoadedData<Movie[]>;
}

export default function MovieList({ movies: loadedMovies }: MovieListProps) {
  const { user } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetchMoviesError, setFetchMoviesError] = useState<string | null>(null);

  const initializeMovies = async () => {
    if (loadedMovies.data) {
      setMovies(loadedMovies.data);
    } else if (loadedMovies.error) {
      setFetchMoviesError(loadedMovies.error);
    }
  };

  useEffect(() => {
    initializeMovies();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {movies.length > 0 && (
        <>
          <div className="space-y-2 sm:space-y-3">
            {fetchMoviesError && (
              <div className="rounded-sm bg-red-100 p-4">
                <p className="text-textcolor/80">{fetchMoviesError}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </div>
          </div>
        </>
      )}

      {user && user.isAdmin && (
        <div className="flex justify-center">
          <div className="w-full max-w-[400px]">
            <MovieCreateForm movies={movies} setMovies={setMovies} />
          </div>
        </div>
      )}
    </div>
  );
}