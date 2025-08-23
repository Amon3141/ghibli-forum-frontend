'use client';
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Comment } from "@/types/database";
import ProfileIcon from "@/components/features/user/ProfileIcon";
import UsernameInline from "@/components/features/user/UsernameInline";
import { getSemanticDateString } from "@/utils/dateHelpers";
import TrashButton from "@/components/ui/action/TrashButton";

interface CommentCardInProfileProps {
  comment: Comment;
  onClickTrashButton?: (commentId: number) => void;
}

export default function CommentCardInProfilePage({ comment, onClickTrashButton }: CommentCardInProfileProps) {
  const { user } = useAuth();

  const getThreadUrlFromComment = (comment: Comment) => {
    if (comment.thread) {
      return `/movies/${comment.thread.movieId}/threads/${comment.threadId}`;
    }
    return '/';
  }
  
  return (
    <div className="px-2.5 sm:px-3 pt-2.5 pb-3 sm:pb-4 bg-custom-white rounded-md shadow-sm small-text">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 small-text">
          {comment.thread && !comment.thread.isDeleted ? (
            <Link
              href={getThreadUrlFromComment(comment)}
              className="underline-link"
            >
              @{comment.thread.title || '無効なスレッドURL'}
            </Link>
          ) : (
            <span>@削除されたスレッド</span>
          )}
        </p>
        <p className="text-xs text-gray-400">{getSemanticDateString(comment.createdAt)}</p>
      </div>
      <div className="flex items-end justify-between w-full gap-1.5 sm:gap-2">
        <div className="flex items-start gap-2.5">
          <ProfileIcon user={comment.author ?? null} size={38} className="mt-0.5" />
          <div className="space-y-1">
            <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-1">
              <UsernameInline user={comment.author} textSize="small-text" />
              {comment.level > 1 && (
                <span className="text-[10px] sm:text-[12px] text-textcolor/80 font-bold">
                  {comment.parent
                    ? `→ ${comment.parent?.author?.username} @${comment.parent?.author?.userId}`
                    : `→ 削除されたコメント`
                  }
                </span>
              )}
            </div>
            <p className="small-text">{comment.content}</p>
          </div>
        </div>
      
        {onClickTrashButton && user && comment.author?.id === user?.id && (
          <TrashButton  onClick={() => onClickTrashButton(comment.id)} />
        )}
      </div>
    </div>
  );
}