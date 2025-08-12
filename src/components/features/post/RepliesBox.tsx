'use client';
import { Comment } from "@/types/database/comment";
import MessageBox from "@/components/ui/MessageBox";
import { MessageBoxType } from "@/types/MessageBoxType";
import ReplyCard from "@/components/features/post/ReplyCard";
import GeneralButton from "@/components/ui/GeneralButton";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface ReplyBoxProps {
  threadId: number;
  replies: Comment[];
  setReplies: React.Dispatch<React.SetStateAction<Comment[]>>;
  selectedCommentId: number;
  fetchRepliesError: string | null;
  setRefreshComment: React.Dispatch<React.SetStateAction<{
    refreshCount: number;
    commentId: number;
  }>>;
  onClickCommentTrashButton: (replyId: number) => void;
  setIsFetchingReplies: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReplyBox({
  threadId,
  replies,
  setReplies,
  selectedCommentId,
  setRefreshComment,
  fetchRepliesError,
  onClickCommentTrashButton
}: ReplyBoxProps) {
  const [newReply, setNewReply] = useState<string>("");
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const [isPostingReply, setIsPostingReply] = useState<boolean>(false);
  const [postReplyError, setPostReplyError] = useState<string | null>(null);

  const handlePostReply = async (reply: string, parentId: number, replyToId: number | null) => {
    setIsPostingReply(true);
    setPostReplyError(null);
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content: reply,
        parentId,
        replyToId: replyToId || undefined
      });
      setReplies([...replies, response.data]);
      setRefreshComment((prev) => ({
        refreshCount: prev.refreshCount + 1,
        commentId: parentId
      }));
    } catch (err: any) {
      console.error(err.response?.data?.error || '返信投稿時にエラーが発生しました', err);
      setPostReplyError(err.response?.data?.error || '返信投稿時にエラーが発生しました');
    } finally {
      setIsPostingReply(false);
    }
  }

  // 選択コメントが変更されたらそのコメントへの返信を取得
  useEffect(() => {
    if (selectedCommentId) {
      setNewReply("");
      setPostReplyError(null);
      setIsPostingReply(false);
    }
  }, [selectedCommentId])

  return (
    <div className={`
      w-full
      bg-white rounded-md p-4
      flex flex-col
      sticky top-0
    `}>
      <div className="flex items-center justify-between w-full">
        <h3 className="font-bold text-lg">返信</h3>
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-3"></div>
      {fetchRepliesError && (
        <MessageBox type={MessageBoxType.ERROR} message={fetchRepliesError} className="mt-3" />
      )}
      <div className="flex-1 max-h-[56vh] overflow-y-scroll no-scrollbar">
        <div className="flex flex-col mt-3">
          {replies && replies.map((reply) => (
            <div key={reply.id}>
              <ReplyCard
                replyData={reply}
                onClickTrashButton={() => {
                  onClickCommentTrashButton(reply.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 mt-1">
        <textarea
          className={`
            w-full p-3 border border-gray-300 rounded-md
            resize-none focus:outline-none
          `}
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          rows={3}
          placeholder="返信を入力してください..."
        />
        {postReplyError && (
          <MessageBox type={MessageBoxType.ERROR} message={postReplyError} />
        )}
        <GeneralButton
          className={`
            text-sm font-semibold bg-primary/60 border-primary
            ${!newReply && 'hover:bg-primary/60 pointer-events-none'}
          `}
          onClick={async () => {
            await handlePostReply(newReply, selectedCommentId, replyToId);
            setNewReply("");
          }}
          color="primary"
        >
          {isPostingReply ? "返信中..." : "返信"}
        </GeneralButton>
      </div>
    </div>
  );
}