import Link from 'next/link';
import { FaRegComments } from "react-icons/fa6";

import { Thread } from '@/types/thread';

interface ThreadCardProps {
  movieId: number,
  thread: Thread
}

export default function ThreadCard({
  movieId, thread
}: ThreadCardProps) {
  return (
    <div>
      <Link href={`/movies/${movieId}/threads/${thread.id}`}>
        <div className="
          clickable-card px-4 py-4 bg-white rounded-lg
          flex flex-col items-start gap-1.5
        ">
          <div className="flex items-center justify-between w-full">
            <h4 className="text-lg font-bold">{thread.title}</h4>
            <div className="flex items-center gap-1">
              <FaRegComments className="text-lg"/>
              <span>{thread._count?.comments ?? 0}</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-sm">
            <span className="text-sm">投稿者:</span>
            {thread.creator ? (
              <span className="flex items-center gap-1">
                <span className="font-bold text-sm">{thread.creator.username}</span>
                <span className="text-textcolor/80 text-sm">@{thread.creator.userId}</span>
              </span>
            ) : (
              <span className="font-bold text-sm">無名さん</span>
            )}
          </p>
          <p className="text-sm">{thread.description}</p>
        </div>
      </Link>
    </div>
  )
}