import HeroSection from '@/components/features/HeroSection';
import MovieList from '@/components/features/movies/MovieList';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <div className="text-center pt-2 pb-1 mt-4">
        <h2 
          className="text-[1.5rem] tracking-wider text-textcolor/90"
          style={{ 
            fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
            fontWeight: 400
          }}
        >
          スペース一覧
        </h2>
        <div className="w-30 h-[2.5px] rounded-full bg-primary mx-auto mt-2"></div>
      </div>
      <MovieList />
    </main>
  );
}