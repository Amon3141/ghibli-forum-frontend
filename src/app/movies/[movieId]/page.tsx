import { Movie } from "@/types/database/movie";
import { api } from "@/utils/api";
import MoviePageClient from "./MoviePageClient";
import { LoadedData } from "@/types/loadedData";

interface MoviePageProps {
  params: Promise<{
    movieId: number;
  }>
}

const fetchMovie = async (movieId: number): Promise<LoadedData<Movie>> => {
  try {
    const response = await api.get(`/movies/${movieId}`);
    return {
      data: response.data, error: null
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || '映画取得時にエラーが発生しました';
    console.error(errorMessage, err);
    return {
      data: null, error: errorMessage
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movieId } = await params;
  const fetchedData = await fetchMovie(movieId);

  return (
    <MoviePageClient
      movieId={movieId}
      loadedMovie={fetchedData}
    />
  )
}