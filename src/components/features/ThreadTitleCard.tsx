import LikeButton from "@/components/features/action_buttons/LikeButton";

export default function ThreadTitleCard({
  title, creator, summary, likes
}: {
  title: string, creator: string, summary: string, likes: number
}) {
  // TODO: スレッドのいいねAPIルートを作る&繋げる
  return (
    <div className="space-y-2 bg-white rounded-lg p-6">
      <h4 className="text-3xl font-bold">{title}</h4>
      <p className="text-sm">投稿者: {creator}</p>
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