import Link from 'next/link';
import { FaRegComments, FaRegHeart } from "react-icons/fa6";

import { Thread } from '@/types/database';
import UsernameInline from '../user/UsernameInline';
import { getSemanticDateString } from '@/utils/dateHelpers';

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
          clickable-card p-2.5 sm:p-3 pt-1.5 sm:pt-2 pl-3 sm:pl-3.5 bg-custom-white rounded-lg
          flex flex-col items-start gap-1.5 small-text
        ">
          <div className="flex items-start justify-between w-full">
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold truncate">
                  {thread.title}
                </h4>
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/50 border-1 border-primary rounded-full flex-shrink-0 mt-1">
                  <FaRegComments className="text-textcolor text-sm sm:text-base"/>
                  <span className="small-text text-textcolor/90">{thread._count?.comments ?? 0}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-3">{getSemanticDateString(thread.createdAt)}</p>
          </div>
          <p className="flex items-center gap-1 text-xs">
            <span>投稿者:</span>
            <UsernameInline user={thread.creator} textSize="text-xs" />
          </p>
          <p className="mt-0.5">{thread.description}</p>
        </div>
      </Link>
    </div>
  )
}