'use client';
import { useState } from 'react';
import HeroSection from '@/components/features/HeroSection';
import MovieList from '@/components/features/movies/MovieList';
import KikiWelcomeAnimation from '@/components/features/KikiWelcomeAnimation';
import { LoadedData } from '@/types/ssr';
import { Movie } from '@/types/database';

interface HomeClientProps {
  loadedMovies: LoadedData<Movie[]>;
}

export default function HomeClient({ loadedMovies }: HomeClientProps) {
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);

  const handleAnimationComplete = () => {
    setShowWelcomeAnimation(false);
  };

  const triggerShowMainContent = () => {
    setShowMainContent(true);
  };

  // Show main home content after animation
  return (
    <>
      {showWelcomeAnimation && (
        <KikiWelcomeAnimation
          onAnimationComplete={handleAnimationComplete}
          triggerShowMainContent={triggerShowMainContent}
        />
      )}
      {showMainContent && (
        <div className="flex flex-col w-full max-w-[1200px]">
          <HeroSection />
          <div className="text-center py-2 my-3 sm:my-5">
            <h2 className="text-[1.2rem] sm:text-[1.5rem] text-textcolor/90">
              スペース一覧
            </h2>
          </div>
          <MovieList movies={loadedMovies} />

          <style jsx>{`
            .animate-fade-in {
              animation: fade-in 0.8s ease-in-out;
            }

            @keyframes fade-in {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}