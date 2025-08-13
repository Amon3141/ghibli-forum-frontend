import Link from 'next/link';
import { FaRegComments } from "react-icons/fa6";

import { Thread } from '@/types/database/thread';
import UsernameInline from '../user/UsernameInline';

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
          clickable-card p-3 sm:p-3.5 bg-white rounded-lg
          flex flex-col items-start gap-1.5 small-text
        ">
          <div className="flex items-center justify-between w-full">
            <h4 className="text-base sm:text-lg font-bold">{thread.title}</h4>
            <div className="flex items-center gap-1">
              <FaRegComments className="text-sm sm:text-base"/>
              <span>{thread._count?.comments ?? 0}</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-xs">
            <span>投稿者:</span>
            <UsernameInline user={thread.creator} textSize="text-xs" />
          </p>
          <p className="mt-1">{thread.description}</p>
        </div>
      </Link>
    </div>
  )
}