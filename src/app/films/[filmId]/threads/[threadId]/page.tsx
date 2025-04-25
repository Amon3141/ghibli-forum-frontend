'use client';
import { useState } from 'react';
import ThreadTitleCard from "@/components/features/ThreadTitleCard";
import CommentCard from "@/components/features/CommentCard";
import ReplyCard from "@/components/features/ReplyCard";

interface ThreadPageProps {
  params: {
    filmId: string;
    threadId: string;
  }
}

export default function ThreadPage({ params } : ThreadPageProps) {
  const commentData = [
    {
      id: 0,
      date: "2024-04-15",
      time: "14:30",
      content: "千尋が最初は無気力だったのが、最後には勇気を持って行動できるようになる成長が素晴らしいですね。",
      author: "映画好き",
      likes: 12,
      replies: [
        {
          id: 0,
          date: "2024-04-15",
          time: "15:45",
          content: "特に印象的だったのは、ハクのために薬を届けるシーンですね。自分の恐怖を乗り越えて行動する姿に感動しました。",
          author: "アニメファン",
          likes: 8,
          replyTo: null
        },
        {
          id: 1,
          date: "2024-04-15",
          time: "16:20",
          content: "湯屋での労働を通じて、千尋は責任感と自立心を学んでいきます。これは現代の若者にも通じる成長の物語だと思います。",
          author: "ジブリ研究家",
          likes: 15,
          replyTo: "アニメファン"
        },
        {
          id: 2,
          date: "2024-04-15",
          time: "16:25",
          content: "そうですね。千尋の成長は、単なる外見的な変化だけでなく、内面的な強さを獲得していく過程が丁寧に描かれています。特に、最初は泣いてばかりいた彼女が、次第に困難に立ち向かう勇気を身につけていく様子が印象的です。",
          author: "じろう2",
          likes: 9,
          replyTo: "ジブリ研究家"
        },
        {
          id: 3,
          date: "2024-04-15",
          time: "16:44",
          content: "そうですね。また、千尋が湯婆婆との契約を通じて、自分の名前の大切さに気づくシーンも印象的でした。これは自分のアイデンティティを守ることの重要性を示唆していると思います。",
          author: "ハウル",
          likes: 6,
          replyTo: null
        }
      ]
    }, 
    {
      id: 1,
      date: "2024-04-15",
      time: "17:00",
      content: "湯屋の世界観の作り込みが素晴らしいです。特に八百万の神々のデザインが印象的でした。",
      author: "アート好き",
      likes: 10,
      replies: []
    }
  ];

  const threadData = {
    title: "千と千尋の神隠しの考察",
    author: "ジブリファン",
    summary: "千尋の成長と湯屋での経験について語り合いましょう。",
    likes: 24,
    comments: commentData
  };

  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    threadData.comments.length > 0 ? 0 : null
  );

  return (
    <div className="w-full space-y-4">
      <ThreadTitleCard threadData={{
        title: threadData.title,
        author: threadData.author,
        summary: threadData.summary,
        likes: threadData.likes
      }} />
      <div className={`
        h-[83vh]
        flex justify-start items-start gap-4
        transition-all duration-300
      `}>
        <div className="w-[50%] flex flex-col gap-4">
          {threadData.comments.map((comment) => (
            <div key={comment.id}>
              <button onClick={() => setSelectedCommentId(comment.id)}>
                <CommentCard
                  commentData={comment}
                  selectedCommentId={selectedCommentId}
                />
              </button>
            </div>
          ))}
        </div>

        {(() => {
          if (selectedCommentId === null) return null;
          const replies = threadData.comments[selectedCommentId].replies;

          return (
            <div className={`
              flex-1
              bg-white rounded-md p-4
              flex flex-col
            `}>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-lg">返信</h3>
              </div>
              <div className="w-full h-[1px] bg-gray-200 mt-3"></div>
              <div className="flex-1 overflow-y-auto max-h-[54vh]">
                <div className="flex flex-col mt-3">
                  {replies.map((reply) => (
                    <div key={reply.id}>
                      <ReplyCard commentData={reply} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <textarea
                  className={`
                    w-full p-3 border border-gray-300 rounded-md
                    resize-none focus:outline-none
                  `}
                  rows={3}
                  placeholder="返信を入力してください..."
                />
                <button className={`
                  self-end px-4 py-2 bg-primary
                  text-sm rounded-md text-textcolor/80 font-semibold
                  hover:bg-primary/80
                `}>
                  返信
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}