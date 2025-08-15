import Link from "next/link";
import Image from "next/image";
import { PiYarn } from "react-icons/pi";
import { useMemo } from "react";

import { Movie } from "@/types/database/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({movie}: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="
        clickable-card-lg
        w-full bg-custom-white rounded-lg overflow-hidden
      ">
        {movie.imagePath ? (
          <div className="relative aspect-[16/9]">
            <Image
              src={movie.imagePath}
              alt={`${movie.title} image`}
              fill
              className="object-cover"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-primary-dark"></div>
        )}
        
        <div className="flex items-center justify-between py-3 px-3 h-9 sm:h-12 gap-1">
          <div className="font-bold text-xs sm:text-base truncate">{movie.title}</div>
          <div className="flex items-center gap-[2px] sm:gap-[3px]">
            <PiYarn className="text-xs sm:text-base"/>
            <span className="text-[11px] sm:text-sm">{movie._count?.threads ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}