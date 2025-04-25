import ThreadCard from "@/components/features/ThreadCard";

interface FilmPageProps {
  params: {
    filmId: string;
  }
}

export default function FilmPage({ params }: FilmPageProps) {
  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold">{params.filmId.replace('_', ' ')}</h2>
        <p className="">2001年公開 / 監督：宮崎駿</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold py-1">スレッド一覧</h3>
        <ThreadCard
          title="千と千尋の神隠しの考察"
          author="ジブリファン"
          summary="千尋の成長と湯屋での経験について語り合いましょう。"
          filmId={params.filmId}
          threadId="1"
        />
      </div>
    </div>
  )
}