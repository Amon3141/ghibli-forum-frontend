import LikeButton from "@/components/features/action/LikeButton";
import UsernameInline from "../user/UsernameInline";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";
import { Thread } from "@/types/thread";

interface ThreadHeaderProps {
  thread: Thread
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
  const { user } = useAuth();
  
  const handleClickLikeButton = () => {
    try {
      api.put(`/threads/${thread.id}/reaction`, {
        reactionType: 'LIKE'
      });
    } catch (err: any) {
      console.error(err.response?.data?.error || 'スレッドのいいねに失敗しました', err);
    }
  }

  return (
    <div className="space-y-2 bg-white rounded-lg p-6">
      <h4 className="text-3xl font-bold">{thread.title}</h4>
      <UsernameInline user={thread.creator} />
      <div className="w-full h-[1px] bg-gray-200 my-4"></div>
      <p className="pb-2">{thread.description}</p>
      <LikeButton
        likes={thread.reactions?.filter((reaction) => reaction.type === 'LIKE').length ?? 0}
        isLiked={thread.reactions?.some(
          (reaction) => reaction.user?.userId === user?.userId && reaction.type === 'LIKE'
        ) ?? false}
        onClick={() => handleClickLikeButton()}
      />
    </div>
  )
}