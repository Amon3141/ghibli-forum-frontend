import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/comment";

import LikeButton from "@/components/features/action/LikeButton";
import TrashButton from "@/components/features/action/TrashButton";
import UsernameIcon from "../user/UsernameIcon";

interface ReplyCardProps {
  replyData: Comment,
  onClickTrashButton: (replyId: number) => void
}

export default function ReplyCard({ replyData, onClickTrashButton: handleClickTrashButton }: ReplyCardProps) {
  const { user } = useAuth();
  const userDBId = user?.id;
  
  const handleClickLikeButton = (isLike: boolean) => {
    try {
      api.put(`/comments/${replyData.id}/likes`, {
        increment: isLike
      });
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメントのいいねに失敗しました', err);
    }
  };

  return (
    <div className={`
      py-1 text-left
      flex flex-col items-start gap-2
      group/reply-card
    `}>
      <div className="flex items-center justify-between w-full">
        <UsernameIcon user={replyData.author} />
        <p className="text-xs text-gray-500">{format(new Date(replyData.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}</p>
      </div>
      <p>{replyData.content}</p>
      <div className="flex items-center justify-between w-full">
        <LikeButton
          likes={replyData.likes}
          isLiked={false}
          onLike={() => handleClickLikeButton(true)}
          onUnlike={() => handleClickLikeButton(false)}
        />
        {replyData.author?.id === userDBId && (
          <div className="opacity-0 group-hover/reply-card:opacity-100">
            <TrashButton onClick={() => handleClickTrashButton(replyData.id)} />
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-2 mb-3"></div>
    </div>
  );
}