import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { Comment } from "@/types/comment";
import ProfileIcon from "@/components/features/user/ProfileIcon";
import UsernameInline from "@/components/features/user/UsernameInline";

interface CommentCardInProfileProps {
  comment: Comment;
}

export default function CommentCardInProfilePage({ comment }: CommentCardInProfileProps) {
  const getThreadUrlFromComment = (comment: Comment) => {
    if (comment.thread) {
      return `/movies/${comment.thread.movieId}/threads/${comment.threadId}`;
    }
    return '/';
  }
  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">
          <Link
            href={getThreadUrlFromComment(comment)}
            className="text-amber-600 hover:underline"
          >
            @{comment.thread?.title || '無効なスレッドURL'}
          </Link>
          {comment.parent && (
            <span className="text-sm text-textcolor/90 font-bold"> (返信先: {comment.parent?.author?.username} @{comment.parent?.author?.userId})</span>
          )}
        </p>
        <p className="text-xs text-gray-400">
          {format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}
        </p>
      </div>
      <div className="flex items-start gap-2.5">
        <ProfileIcon user={comment.author ?? null} size={38} className="mt-0.5" />
        <div>
          <UsernameInline user={comment.author} />
          <p>{comment.content}</p>
        </div>
      </div>
    </div>
  );
}