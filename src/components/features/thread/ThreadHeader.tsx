import LikeButton from "@/components/ui/action/LikeButton";
import UsernameInline from "../user/UsernameInline";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";
import { Thread, ReactionType } from "@/types/database";
import Link from "next/link";
import TrashButton from "@/components/ui/action/TrashButton";

interface ThreadHeaderProps {
  thread: Thread;
  onClickThreadTrashButton: (threadId: number) => void;
}

export default function ThreadHeader({ thread, onClickThreadTrashButton }: ThreadHeaderProps) {
  const { user } = useAuth();
  
  const handleClickLikeButton = () => {
    try {
      api.put(`/threads/${thread.id}/reaction`, {
        reactionType: ReactionType.Like
      });
    } catch (err: any) {
      // console.error(err.response?.data?.error || 'スレッドのいいねに失敗しました', err);
    }
  }

  return (
    <div className="space-y-2 bg-custom-white rounded-lg p-4 sm:p-5 small-text border-1 border-gray-100 group/thread-header">
      <h4 className="text-xl font-bold">{thread.title}</h4>
      <div className="flex items-center gap-1">
        <span className="text-textcolor/80">投稿者:</span>
        <UsernameInline user={thread.creator} /> →
        <Link href={`/movies/${thread.movieId}`}>
          <span className="underline-link">{thread.movie?.title}</span>
        </Link>
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-4 mb-2.5"></div>
      <p className="mb-3">{thread.description}</p>
      <div className="flex items-center justify-between">
        <LikeButton
          likes={thread.reactions?.filter((reaction) => reaction.type === 'LIKE').length ?? 0}
          isLiked={thread.reactions?.some(
            (reaction) => reaction.user?.userId === user?.userId && reaction.type === 'LIKE'
          ) ?? false}
          onClick={() => handleClickLikeButton()}
        />
        {user && thread.creator?.id === user?.id && (
          <div className="opacity-0 group-hover/thread-header:opacity-100">
            <TrashButton onClick={() => onClickThreadTrashButton(thread.id)} />
          </div>
        )}
      </div>
    </div>
  )
}