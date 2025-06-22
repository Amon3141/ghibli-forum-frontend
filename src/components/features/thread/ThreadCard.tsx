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
        <div className="clickable-card px-4 py-5 bg-white rounded-lg">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <h4 className="text-xl font-bold">{thread.title}</h4>
              <div className="flex items-center gap-1">
                <FaRegComments className="text-lg"/>
                <span>{thread._count?.comments ?? 0}</span>
              </div>
            </div>
            <p className="flex items-center gap-1 text-sm">
              <span>投稿者:</span>
              {thread.creator ? (
                <span className="flex items-center gap-1">
                  <span className="font-bold">{thread.creator.username}</span>
                  <span className="text-textcolor/80">@{thread.creator.userId}</span>
                </span>
              ) : (
                <span className="font-bold">無名さん</span>
              )}
            </p>
            <p>{thread.description}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}