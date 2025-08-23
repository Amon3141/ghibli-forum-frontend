'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MovieCard from "@/components/features/movies/MovieCard";
import MovieCreateForm from './MovieCreateForm';
import { LoadedData } from '@/types/ssr';
import { Movie } from '@/types/database';
import { SortDirection } from '@/types/sort';
import SortIcon from '@/components/ui/SortIcon';

interface MovieListProps {
  movies: LoadedData<Movie[]>;
}

export default function MovieList({ movies: loadedMovies }: MovieListProps) {
  const { user } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetchMoviesError, setFetchMoviesError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.desc);

  const sortMoviesByReleaseDate = (movies: Movie[], sortDirection: SortDirection) => {
    return [...movies].sort((a, b) => {
      return sortDirection === SortDirection.asc
        ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  };

  const initializeMovies = async () => {
    if (loadedMovies.data) {
      const sortedMovies = sortMoviesByReleaseDate(loadedMovies.data, sortDirection);
      setMovies(sortedMovies);
    } else if (loadedMovies.error) {
      setFetchMoviesError(loadedMovies.error);
    }
  };

  const handleSortMovies = () => {
    const newSortDirection = sortDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
    setSortDirection(newSortDirection);
  }

  useEffect(() => {
    initializeMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const sortedMovies = sortMoviesByReleaseDate(movies, sortDirection);
      setMovies(sortedMovies);
    }
  }, [sortDirection]);

  return (
    <div className="w-full flex flex-col items-end gap-3">
      {movies.length > 0 && (
        <button
          onClick={handleSortMovies}
          className={"flex items-center gap-1 small-text text-gray-600"}
        >
          <span>公開日</span>
          <SortIcon
            isSorted={true}
            sortDirection={sortDirection}
          />
        </button>
      )}
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
    </div>
  );
}