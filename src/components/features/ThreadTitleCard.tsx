interface ThreadData {
  title: string,
  author: string,
  summary: string,
  likes: number,
}

export default function ThreadTitleCard({ threadData }: { threadData: ThreadData })
{

  return (
    <div className="space-y-2 bg-white rounded-lg p-6">
      <h4 className="text-3xl font-bold">{threadData.title}</h4>
      <p className="text-sm">投稿者: {threadData.author}</p>
      <div className="w-full h-[1px] bg-gray-200 my-4"></div>
      <p className="pb-2">{threadData.summary}</p>
      <div className="flex items-center justify-start">
        <p>❤︎ {threadData.likes}</p>
      </div>
    </div>
  )
}