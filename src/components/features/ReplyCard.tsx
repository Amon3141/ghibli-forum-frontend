interface ReplyCardProps {
  commentData: {
    id: number,
    date: string,
    time: string,
    content: string,
    author: string,
    likes: number,
    replyTo: string | null
  }
}

export default function ReplyCard({ commentData }: ReplyCardProps) {
  return (
    <div className={`
      py-1 text-left
      flex flex-col items-start gap-2
    `}>
      <div className="flex items-end justify-between w-full">
        <p className="font-bold">{commentData.author}</p>
        <p className="text-sm">{commentData.date} {commentData.time}</p>
      </div>
      <p>{commentData.content}</p>
      <p className="text-sm">❤︎ {commentData.likes}</p>
      <div className="w-full h-[1px] bg-gray-200 mt-2 mb-3"></div>
    </div>
  );
}