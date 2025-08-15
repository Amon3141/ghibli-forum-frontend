import Link from "next/link";
import { Comment } from "@/types/database/comment";
import ProfileIcon from "@/components/features/user/ProfileIcon";
import UsernameInline from "@/components/features/user/UsernameInline";
import { getSemanticDateString } from "@/utils/dateHelpers";

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
    <div className="px-2.5 sm:px-3 pt-2.5 pb-3 sm:pb-4 bg-custom-white rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 small-text">
          <Link
            href={getThreadUrlFromComment(comment)}
            className="underline-link"
          >
            @{comment.thread?.title || '無効なスレッドURL'}
          </Link>
          {comment.parent && (
            <span className="small-text text-textcolor/90 font-bold"> (返信先: {comment.parent?.author?.username} @{comment.parent?.author?.userId})</span>
          )}
        </p>
        <p className="text-xs text-gray-400">{getSemanticDateString(comment.createdAt)}</p>
      </div>
      <div className="flex items-start gap-2.5">
        <ProfileIcon user={comment.author ?? null} size={38} className="mt-0.5" />
        <div className="space-y-1">
          <UsernameInline user={comment.author} textSize="small-text" />
          <p className="small-text">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}