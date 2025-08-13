import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useIsSm } from "@/hook/useIsScreenWidth";
import { Comment } from "@/types/database/comment";

import LikeButton from "@/components/features/action/LikeButton";
import TrashButton from "@/components/features/action/TrashButton";
import UsernameIcon from "../user/UsernameIcon";

interface ReplyCardProps {
  replyData: Comment,
  onClickTrashButton: (replyId: number) => void
}

export default function ReplyCard({ replyData, onClickTrashButton: handleClickTrashButton }: ReplyCardProps) {
  const isSm = useIsSm();
  const { user } = useAuth();
  
  const handleClickLikeButton = () => {
    try {
      api.put(`/comments/${replyData.id}/reaction`, {
        reactionType: 'LIKE'
      });
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメントのいいねに失敗しました', err);
    }
  };

  return (
    <div className={`
      p-1 text-left
      flex flex-col items-start gap-1.5 sm:gap-2
      group/reply-card small-text
    `}>
      <div className="flex items-start justify-between w-full">
        <UsernameIcon user={replyData.author} size={isSm ? 38 : 33} />
        <p className="text-xs text-gray-500">{format(new Date(replyData.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}</p>
      </div>
      <p>{replyData.content}</p>
      <div className="flex items-center justify-between w-full mt-1">
        <LikeButton
          likes={replyData.reactions?.filter((reaction) => reaction.type === 'LIKE').length ?? 0}
          isLiked={replyData.reactions?.some(
            (reaction) => reaction.user?.userId === user?.userId && reaction.type === 'LIKE'
          ) ?? false}
          onClick={() => handleClickLikeButton()}
        />
        {replyData.author?.id === user?.id && (
          <div className="opacity-0 group-hover/reply-card:opacity-100">
            <TrashButton onClick={() => handleClickTrashButton(replyData.id)} />
          </div>
        )}
      </div>
    </div>
  );
}