'use client';
import { useEffect, useRef, useState } from "react";
import { Comment } from "@/types/database";
import MessageBox from "@/components/ui/MessageBox";
import { MessageBoxType } from "@/types/types";
import ReplyCard from "@/components/features/post/ReplyCard";
import GeneralButton from "@/components/ui/GeneralButton";
import { IoSend } from "react-icons/io5";
import { api } from "@/utils/api";
import { useIsSm } from "@/hooks/useIsScreenWidth";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPopup } from "@/contexts/LoginPopupContext";

export enum RepliesBoxType {
  Side = 'side',
  Below = 'below'
}

interface RepliesBoxProps {
  type: RepliesBoxType;
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

export default function RepliesBox({
  type,
  threadId,
  replies,
  setReplies,
  selectedCommentId,
  setRefreshComment,
  fetchRepliesError,
  onClickCommentTrashButton
}: RepliesBoxProps) {
  const isSm = useIsSm();
  const { user } = useAuth();
  const { openLoginPopupWithMessage } = useLoginPopup();
  
  const [newReply, setNewReply] = useState<string>("");
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const [isPostingReply, setIsPostingReply] = useState<boolean>(false);
  const [postReplyError, setPostReplyError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBelow = (type === RepliesBoxType.Below);

  const handlePostReply = async (reply: string, parentId: number, replyToId: number | null) => {
    if (!user) {
      openLoginPopupWithMessage('会話に参加しよう');
      return;
    }
    setIsPostingReply(true);
    setPostReplyError(null);
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content: reply,
        level: 2,
        parentId,
        replyToId: replyToId || undefined
      });
      setReplies([response.data, ...replies]);
      setRefreshComment((prev) => ({
        refreshCount: prev.refreshCount + 1,
        commentId: parentId
      }));
    } catch (err: any) {
      setPostReplyError(err.response?.data?.error || '返信投稿時にエラーが発生しました');
    } finally {
      setNewReply("");
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
  }, [selectedCommentId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newReply]);

  return (
    <div className={`
      relative w-full bg-custom-white rounded-md py-3 px-3
      flex flex-col
      ${type === RepliesBoxType.Below 
        ? "rounded-t-none pt-0 pl-8" 
        : ""
      }
      ${type === RepliesBoxType.Below && isSm ? "outline-1 outline-primary" : ""}
    `}>
      {!isBelow && (
        <>
          <h3 className="font-bold text-md">返信</h3>
          <div className={`
            w-full h-[1px] bg-gray-200 mt-3 ${replies.length === 0 ? "mb-1" : ""}
          `}></div>
        </>
      )}
      {fetchRepliesError && (
        <MessageBox type={MessageBoxType.Error} message={fetchRepliesError} className="mt-3" />
      )}
      <div className={`
        flex-1 overflow-y-scroll no-scrollbar
        ${isBelow ? "max-h-[40vh]" : "max-h-[57vh]"}
      `}>
        <div className="flex flex-col">
          {replies && replies.map((reply) => (
            <div key={reply.id} className="mt-3">
              <ReplyCard
                replyData={reply}
                onClickTrashButton={() => {
                  onClickCommentTrashButton(reply.id);
                }}
              />
              <div className="w-full h-px bg-gray-200 mt-1.5"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="
        relative flex items-end gap-2 pt-2 rounded-none
      ">
        <textarea
          ref={textareaRef}
          className={`
            w-full p-2 sm:p-2.5 border border-gray-300 rounded-md
            resize-none focus:outline-none max-h-[140px]
            overflow-y-auto small-text
          `}
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="返信を入力してください..."
        />
        {postReplyError && (
          <MessageBox type={MessageBoxType.Error} message={postReplyError} />
        )}
        <div className="absolute bottom-2.5 right-2.5">
          <GeneralButton
            className={`
              !p-2 rounded-full text-sm font-semibold
              bg-primary/60 backdrop-blur-sm border-primary
              ${newReply !== ""
                ? 'hover:bg-primary/80 popup-element'
                : 'hover:bg-primary/60'
              }
            `}
            onClick={async () => {
              await handlePostReply(newReply, selectedCommentId, replyToId);
            }}
            disabled={newReply === ""}
            color="primary"
          >
            {isPostingReply 
              ? <IoSend className="animate-spin" />
              : <IoSend />
            }
          </GeneralButton>
        </div>
      </div>
    </div>
  );
}