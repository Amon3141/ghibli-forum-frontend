import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { Comment } from "@/types/comment";

interface CommentCardInProfileProps {
  comment: Comment;
  commentType: 'comments' | 'replies';
}

export default function CommentCardInProfile({ comment, commentType }: CommentCardInProfileProps) {
  const getThreadUrlFromComment = (comment: Comment) => {
    if (comment.thread) {
      return `/movies/${comment.thread.movieId}/threads/${comment.threadId}`;
    }
    return '/';
  }
  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <p className="text-gray-500 text-sm mb-2">
        <Link
          href={getThreadUrlFromComment(comment)}
          className="text-amber-600 hover:underline"
        >
          @{comment.thread?.title || '無効なスレッドURL'}
        </Link>
        {commentType === 'replies' && (
          <span className="text-gray-500 text-sm">
            {' to '} <span className="text-textcolor/90 font-bold">{comment.parent?.author?.username} @{comment.parent?.author?.userId}</span>
          </span>
        )}
      </p>
      <p className="mb-2">{comment.content}</p>
      <p className="text-xs text-gray-400">
        {format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}
      </p>
    </div>
  );
}