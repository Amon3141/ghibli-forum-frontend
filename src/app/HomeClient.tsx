import HeroSection from '@/components/features/HeroSection';
import MovieList from '@/components/features/movies/MovieList';
import { LoadedData } from '@/types/loadedData';
import { Movie } from '@/types/database/movie';

interface HomeClientProps {
  loadedMovies: LoadedData<Movie[]>;
}

export default function HomeClient({ loadedMovies }: HomeClientProps) {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <div className="text-center pt-2 mt-2 sm:mt-3 mb-1">
        <h2 className="text-[1.2rem] sm:text-[1.5rem] text-textcolor/90">
          スペース一覧
        </h2>
        <div className="w-26 sm:w-30 h-[2px] sm:h-[2.5px] rounded-full bg-primary mx-auto mt-1.5 sm:mt-2"></div>
      </div>
      <MovieList movies={loadedMovies} />
    </div>
  );
}