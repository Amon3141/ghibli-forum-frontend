import Link from 'next/link';
import { FaRegComments, FaRegHeart } from "react-icons/fa6";

import { Thread } from '@/types/database';
import UsernameInline from '../user/UsernameInline';
import { getSemanticDateString } from '@/utils/dateHelpers';
import AnalyticsIcon from '@/components/ui/AnalyticsIcon';

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
          flex flex-col items-start small-text gap-0.5
        ">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-1 items-center gap-2 min-w-0 mr-3">
              <h4 className="text-base sm:text-lg font-bold truncate">
                {thread.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <AnalyticsIcon icon={FaRegComments} analyticsNumber={thread._count?.comments} color="primary" size="small" />
                <AnalyticsIcon icon={FaRegHeart} analyticsNumber={thread._count?.reactions} color="rose" size="small" />
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-3">{getSemanticDateString(thread.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>投稿者:</span>
            <UsernameInline user={thread.creator} textSize="text-xs" />
          </div>
          <p className="mt-1.5">{thread.description}</p>
        </div>
      </Link>
    </div>
  )
}