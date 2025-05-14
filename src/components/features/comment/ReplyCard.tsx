import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

import LikeButton from "@/components/features/action_buttons/LikeButton";
import TrashButton from "@/components/features/action_buttons/TrashButton";

interface ReplyCardProps {
  replyData: {
    id: number,
    createdAt: string,
    content: string,
    author: {
      id: number,
      username: string,
      userId: string
    } | null,
    likes: number,
    replyTo: string | null
  },
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
      <div className="flex items-end justify-between w-full">
        <p className="font-bold">{replyData.author?.username || "不明"} <span className="text-textcolor/70">@{replyData.author?.userId ?? "不明"}</span></p>
        <p className="text-sm">{format(new Date(replyData.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}</p>
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
          <div className="opacity-0 group-hover/reply-card:opacity-100 transition-opacity duration-200">
            <TrashButton onClick={() => handleClickTrashButton(replyData.id)} />
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-2 mb-3"></div>
    </div>
  );
}