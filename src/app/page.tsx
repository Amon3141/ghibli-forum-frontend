import HomeClient from "./HomeClient";
import { api } from "@/utils/api";
import { Movie } from "@/types/database/movie";
import { LoadedData } from "@/types/loadedData";

const fetchMovies = async (): Promise<LoadedData<Movie[]>> => {
  try {
    const response = await api.get<Movie[]>('/movies');
    return { data: response.data, error: null };
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || '映画取得時にエラーが発生しました';
    console.error(errorMessage, err);
    return { data: null, error: errorMessage };
  }
};

export default async function Home() {
  const fetchedMovies = await fetchMovies();
  return <HomeClient loadedMovies={fetchedMovies} />;
}