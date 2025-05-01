import Link from 'next/link';

export default function ThreadCard({
  movieId, threadId, title, author, summary
}: {
  movieId: number, threadId: number, title: string, author: string, summary: string
})
{
  return (
    <div>
      <Link href={`/movies/${movieId}/threads/${threadId}`}>
        <div className="
          clickable-card
          p-6 bg-white rounded-lg
        ">
          <div className="flex flex-col items-start gap-2">
            <h4 className="text-xl font-bold">{title}</h4>
            <p className="text-sm">投稿者: {author}</p>
            <p>{summary}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}