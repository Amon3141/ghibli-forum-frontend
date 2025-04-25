import Link from "next/link";

export default function FilmCard({
    title, filmId 
  }: {
    title : string, filmId : string
  }) {
  return (
    <Link href={`/films/${filmId}`}>
      <div className="
        clickable-card-md
        w-full bg-white rounded-lg overflow-hidden
      ">
        <div className="aspect-[16/9] bg-primary-dark"></div>
        <div className="p-4">
          <div className="font-bold text-lg">{title}</div>
        </div>
      </div>
    </Link>
  )
}