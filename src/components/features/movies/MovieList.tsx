'use client';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

import MovieCard from "@/components/features/movies/MovieCard";
import InputField from '@/components/ui/InputField';
import GeneralButton from '@/components/ui/GeneralButton';

import { Movie } from '@/types/movie';
type MovieFormData = Omit<Movie, 'id' | 'threads'>;

export default function MovieList() {
  const { user } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetchMoviesError, setFetchMoviesError] = useState<string | null>(null);

  const [newMovie, setNewMovie] = useState<MovieFormData>({
    title: '',
    director: '',
    releaseDate: ''
  });
  const [createMovieError, setCreateMovieError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await api.get<Movie[]>('/movies');
      setMovies(response.data);
    } catch (err: any) {
      console.error('Failed to fetch movies:', err);
      setFetchMoviesError(err.response?.data?.error || '映画取得時にエラーが発生しました');
    }
  };

  const handleCreateMovie = async () => {
    try {
      console.log("Request headers:", api.defaults.headers); // test
      const response = await api.post('/movies', newMovie);
      setMovies([...movies, response.data.movie]);
    } catch (err: any) {
      console.error('Failed to create movie:', err);
      setCreateMovieError(err.response?.data?.error || '映画登録時にエラーが発生しました');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="space-y-6 w-full px-2">
      {movies.length > 0 && (
        <>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">作品別</h2>
            {fetchMoviesError && (
              <div className="rounded-sm bg-red-100 p-4">
                <p className="text-textcolor/80">{fetchMoviesError}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </div>
          </div>
        </>
      )}

      {user && user.isAdmin && (
        <>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold py-2">新規作成</h2>
            {createMovieError && (
              <div className="rounded-sm bg-red-100 p-4">
                <p className="text-textcolor/80">{createMovieError}</p>
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateMovie();
            }}>
              <div className="flex flex-col items-start w-1/2 space-y-3 mb-4">
                <InputField
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="タイトル"
                />
                <InputField
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  placeholder="監督"
                />
                <InputField
                  value={newMovie.releaseDate}
                  onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                  placeholder="公開日 (yyyy-mm-dd)"
                />
                <input type="file" accept="image/*" className="[&::-webkit-file-upload-button]:border [&::-webkit-file-upload-button]:border-gray-300 [&::-webkit-file-upload-button]:rounded-sm [&::-webkit-file-upload-button]:p-2" />
              </div>
              <GeneralButton type="submit">作成</GeneralButton>
            </form>
          </div>
        </>
      )}
    </div>
  );
}