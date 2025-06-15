"use client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/comment";
import { FaRegComment } from "react-icons/fa";

import LikeButton from "@/components/features/action/LikeButton";
import TrashButton from "@/components/features/action/TrashButton";
import UsernameIcon from "@/components/features/user/UsernameIcon";
import { useState, useEffect } from "react";

interface CommentCardProps {
  commentData: Comment,
  selectedCommentId: number | null,
  onClickShowReply: () => void,
  onClickTrashButton: (commentId: number) => void
}

export default function CommentCard({
  commentData, selectedCommentId, onClickShowReply: handleClickShowReply, onClickTrashButton: handleClickTrashButton
}: CommentCardProps) {
  const userDbId = useAuth().user?.id;
  const [replyCount, setReplyCount] = useState(commentData._count?.replies || 0);
  
  useEffect(() => {
    setReplyCount(commentData._count?.replies || 0);
  }, [commentData._count?.replies]);
  
  const handleClickLikeButton = (isLike: boolean) => {
    try {
      api.put(`/comments/${commentData.id}/likes`, {
        increment: isLike
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
      ${selectedCommentId === commentData.id ? "bg-primary/70" : "bg-white"}
    `}>
      <div className="flex items-center justify-between w-full">
        <UsernameIcon user={commentData.author} />
        <p className="text-sm">{format(new Date(commentData.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}</p>
      </div>
      <p>{commentData.content}</p>
      {commentData._count && typeof commentData._count.replies === 'number' && commentData._count.replies > 0 && (
        <button onClick={handleClickShowReply}>
          <p className="text-amber-600 underline cursor-pointer">
            {replyCount}件の返信を表示
          </p>
        </button>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <LikeButton
            likes={commentData.likes}
            isLiked={false}
            onLike={() => handleClickLikeButton(true)}
            onUnlike={() => handleClickLikeButton(false)}
          />
          <FaRegComment
            className="cursor-pointer"
            onClick={handleClickShowReply}
          />
        </div>
        {commentData.author?.id === userDbId && (
          <div className="opacity-0 group-hover/comment-card:opacity-100">
            <TrashButton onClick={() => handleClickTrashButton(commentData.id)} />
          </div>
        )}
      </div>
    </div>
  );
}