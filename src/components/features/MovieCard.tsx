import Link from "next/link";
import Image from "next/image";

interface MovieCardProps {
  title : string,
  movieId : number,
  imagePath? : string | null
}

export default function MovieCard({title, movieId, imagePath = null}: MovieCardProps) {
  return (
    <Link href={`/movies/${movieId}`}>
      <div className="
        clickable-card-md
        w-full bg-white rounded-lg overflow-hidden
      ">
        {imagePath ? (
          <div className="relative aspect-[16/9]">
            <Image
              src={imagePath}
              alt={`${title} image`}
              fill
              className="object-cover"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-primary-dark"></div>
        )}
        
        <div className="p-4">
          <div className="font-bold text-lg">{title}</div>
        </div>
      </div>
    </Link>
  )
}