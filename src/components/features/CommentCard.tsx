interface CommentCardProps {
  commentData: {
    id: number,
    date: string,
    time: string,
    content: string,
    author: string,
    likes: number,
  },
  selectedCommentId: number | null
}

export default function CommentCard({
  commentData, selectedCommentId
}: CommentCardProps) {
  return (
    <div className={`
      clickable-card
      rounded-md p-4 text-left
      flex flex-col items-start gap-2
      ${selectedCommentId === commentData.id ? "bg-primary/70" : "bg-white"}
    `}>
      <div className="flex items-end justify-between w-full">
        <p className="font-bold">{commentData.author}</p>
        <p className="text-sm">{commentData.date} {commentData.time}</p>
      </div>
      <p>{commentData.content}</p>
      <div className="flex items-center justify-between w-full">
        <p className="text-sm">❤︎ {commentData.likes}</p>
      </div>
    </div>
  );
}