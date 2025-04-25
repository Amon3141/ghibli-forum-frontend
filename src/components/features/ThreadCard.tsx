import Link from 'next/link';

export default function ThreadCard({
  title, author, summary, filmId, threadId
}: {
  title: string, author: string, summary: string, filmId: string, threadId: string
})
{
  return (
    <Link href={`/films/${filmId}/threads/${threadId}`}>
      <div className="
        clickable-card-md
        p-6 bg-white rounded-lg
      ">
        <div className="flex flex-col items-start gap-2">
          <h4 className="text-lg font-bold">{title}</h4>
          <p className="text-sm">投稿者: {author}</p>
          <p>{summary}</p>
        </div>
      </div>
    </Link>
  )
}