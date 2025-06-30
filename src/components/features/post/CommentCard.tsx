"use client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/comment";
import { FaRegComment } from "react-icons/fa";

import LikeButton from "@/components/features/action/LikeButton";
import TrashButton from "@/components/features/action/TrashButton";
import UsernameIcon from "@/components/features/user/UsernameIcon";
import { useState, useEffect } from "react";
import Link from "next/link";

interface CommentCardProps {
  comment: Comment,
  selectedCommentId: number | null,
  onClickShowReply: () => void,
  onClickTrashButton: (commentId: number) => void
}

export default function CommentCard({
  comment, selectedCommentId, onClickShowReply: handleClickShowReply, onClickTrashButton: handleClickTrashButton
}: CommentCardProps) {
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
      rounded-md px-4 py-3 text-left
      flex flex-col items-start gap-2
      group/comment-card
      ${selectedCommentId === comment.id ? "bg-primary/70 outline-1 outline-primary" : "bg-white"}
    `}>
      <div className="flex items-center justify-between w-full">
        <UsernameIcon user={comment.author} />
        <p className="text-xs text-gray-500">{format(new Date(comment.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}</p>
      </div>
      <p>{comment.content}</p>
      {comment._count && typeof comment._count.replies === 'number' && comment._count.replies > 0 && (
        <button onClick={handleClickShowReply}>
          <p className="text-amber-600 underline cursor-pointer">
            {replyCount}件の返信を表示
          </p>
        </button>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <LikeButton
            likes={comment.reactions?.filter((reaction) => reaction.type === 'LIKE').length ?? 0}
            isLiked={comment.reactions?.some((reaction) => 
              reaction.user?.userId === user?.userId && reaction.type === 'LIKE'
            ) ?? false}
            onClick={() => handleClickLikeButton()}
          />
          <FaRegComment
            className="cursor-pointer"
            onClick={handleClickShowReply}
          />
        </div>
        {comment.author?.id === user?.id && (
          <div className="opacity-0 group-hover/comment-card:opacity-100">
            <TrashButton onClick={() => handleClickTrashButton(comment.id)} />
          </div>
        )}
      </div>
    </div>
  );
}