import LikeButton from "@/components/features/action/LikeButton";
import UsernameInline from "../user/UsernameInline";
import { User } from "@/types/user";

interface ThreadHeaderProps {
  title: string,
  creator?: User | null,
  summary: string,
  likes: number
}

export default function ThreadHeader({
  title, creator, summary, likes
}: ThreadHeaderProps) {
  // TODO: スレッドのいいねAPIルートを作る&繋げる
  return (
    <div className="space-y-2 bg-white rounded-lg p-6">
      <h4 className="text-3xl font-bold">{title}</h4>
      <UsernameInline user={creator} />
      <div className="w-full h-[1px] bg-gray-200 my-4"></div>
      <p className="pb-2">{summary}</p>
      <LikeButton
        likes={likes}
        isLiked={false}
        onLike={() => {}}
        onUnlike={() => {}}
      />
    </div>
  )
}