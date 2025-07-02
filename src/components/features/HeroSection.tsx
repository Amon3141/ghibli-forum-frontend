'use client';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 -mt-4 h-[27vh] bg-emerald-800">
      <Image
        src="/images/hero_background.jpg" 
        alt="welcome to the world of ghibli"
        layout="fill"
        objectFit="cover"
        quality={85}
        className="brightness-80"
      />
      <div className="relative z-10 flex flex-col justify-center h-full">
        <h1 className="
          text-white text-lg sm:text-2xl 
          ml-9 sm:ml-16 mb-3 sm:mb-5 text-shadow-sm tracking-wide
        ">
          ジブリの世界へようこそ
        </h1>
      </div>
    </div>
  );
} 