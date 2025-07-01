'use client';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 -mt-4 h-[27vh]">
      <Image
        src="/images/hero_background.jpg" 
        alt="welcome to the world of ghibli"
        layout="fill"
        objectFit="cover"
        quality={85}
        className="brightness-85"
      />
      <div className="relative z-10 flex flex-col justify-center h-full">
        <h1
          className="text-white text-2xl md:text-3xl ml-16 mb-5 text-shadow-sm"
          style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif" }}
        >
          ジブリの世界へようこそ
        </h1>
      </div>
    </div>
  );
} 