"use client";
import { useState } from "react";
import { api } from "@/utils/api";
import InputField from "@/components/ui/InputField";
import AdminIcon from "../user/AdminIcon";
import GeneralButton from "@/components/ui/GeneralButton";
import { Movie } from "@/types/database";

type MovieFormData = Omit<Movie, 'id' | 'threads'>;

interface MovieCreateFormProps {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export default function MovieCreateForm({ movies, setMovies }: MovieCreateFormProps) {
  const [newMovie, setNewMovie] = useState<MovieFormData>({
    title: '', director: '', releaseDate: ''
  });
  const [createMovieError, setCreateMovieError] = useState<string | null>(null);

  const handleCreateMovie = async () => {
    try {
      const response = await api.post('/movies', newMovie);
      setMovies([...movies, response.data.movie]);
    } catch (err: any) {
      setCreateMovieError(err.response?.data?.error || '映画登録時にエラーが発生しました');
    }
  };

  return (
    <div className="bg-primary/50 border-1 border-primary rounded-md p-3 space-y-2 mb-4">
      <div className="flex items-end gap-2.5">
        <h2 className="text-lg sm:text-xl font-bold pb-1">新規作成</h2>
        <AdminIcon />
      </div>
      {createMovieError && (
        <div className="rounded-sm bg-red-100 p-4">
          <p className="text-textcolor/80">{createMovieError}</p>
        </div>
      )}
      <form className="flex flex-col items-end" onSubmit={(e) => {
        e.preventDefault();
        handleCreateMovie();
      }}>
        <div className="flex flex-col items-start space-y-2 mb-2 w-full">
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
        </div>
        <GeneralButton type="submit">作成</GeneralButton>
      </form>
    </div>
  )
}