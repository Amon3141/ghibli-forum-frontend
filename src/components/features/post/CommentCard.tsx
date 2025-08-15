"use client";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/database/comment";
import { FaRegComment } from "react-icons/fa";

import LikeButton from "@/components/features/action/LikeButton";
import TrashButton from "@/components/features/action/TrashButton";
import UsernameIcon from "@/components/features/user/UsernameIcon";
import { useIsSm } from "@/hook/useIsScreenWidth";
import { getSemanticDateString } from "@/utils/dateHelpers";

interface CommentCardProps {
  comment: Comment,
  selectedCommentId: number | null,
  onClickShowReply: () => void,
  onClickTrashButton: (commentId: number) => void
}

export default function CommentCard({
  comment, selectedCommentId, onClickShowReply: handleClickShowReply, onClickTrashButton: handleClickTrashButton
}: CommentCardProps) {
  const isSm = useIsSm();
  const { user } = useAuth();
  const [replyCount, setReplyCount] = useState(comment._count?.replies || 0);
  
  useEffect(() => {
    setReplyCount(comment._count?.replies || 0);
  }, [comment._count?.replies]);
  
  const handleClickLikeButton = () => {
    try {
      api.put(`/comments/${comment.id}/reaction`, {
        reactionType: 'LIKE'
      });
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメントのいいねに失敗しました', err);
    }
  };

  return (
    <div className={`
      rounded-md px-3.5 sm:px-4 py-2.5 sm:py-3 text-left
      flex flex-col items-start gap-1.5 sm:gap-2
      group/comment-card small-text
      ${selectedCommentId === comment.id 
        ? "bg-gradient-to-b from-primary/50 to-white"
        : "bg-custom-white"
      }
      ${!isSm ? "rounded-b-none" : ""}
    `}>
      <div className="flex items-start justify-between w-full">
        <UsernameIcon user={comment.author} size={isSm ? 38 : 35} />
        <p className="text-xs text-gray-500">{getSemanticDateString(comment.createdAt)}</p>
      </div>
      <p>{comment.content}</p>
      <div className="w-full flex justify-between items-end">
        <div className="flex items-center justify-between w-full mt-1">
          <div className="flex items-center gap-3">
            <LikeButton
              likes={comment.reactions?.filter((reaction) => reaction.type === 'LIKE').length ?? 0}
              isLiked={comment.reactions?.some((reaction) => 
                reaction.user?.userId === user?.userId && reaction.type === 'LIKE'
              ) ?? false}
              onClick={handleClickLikeButton}
            />
            <div className="flex items-center gap-1">
              <FaRegComment
                className="cursor-pointer popup-element"
                onClick={handleClickShowReply}
              />
              {comment._count && typeof comment._count.replies === 'number' && comment._count.replies > 0 && (
                <p className="small-text">{comment._count.replies}</p>
              )}
            </div>
          </div>
          {comment.author?.id === user?.id && (
            <div className="opacity-0 group-hover/comment-card:opacity-100">
              <TrashButton onClick={() => handleClickTrashButton(comment.id)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}