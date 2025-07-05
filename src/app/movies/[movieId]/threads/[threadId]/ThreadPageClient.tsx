'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from "@/utils/api";

import ThreadHeader from "@/components/features/thread/ThreadHeader";
import CommentCard from "@/components/features/post/CommentCard";
import ReplyCard from "@/components/features/post/ReplyCard";
import PostCommentPopup from "@/components/features/post/CommentPopup";
import ConfirmationPopup from "@/components/ui/ConfirmationPopup";
import GeneralButton from "@/components/ui/GeneralButton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MessageBox from "@/components/ui/MessageBox";
import { MessageBoxType } from "@/types/MessageBoxType";
import { LoadedDataForThreadPage } from '@/types/loadedData';

import { FaComment } from "react-icons/fa6";

import { Thread } from "@/types/database/thread";
import { Comment } from "@/types/database/comment";

interface ThreadPageClientProps {
  threadId: number;
  initialData: LoadedDataForThreadPage;
}

export default function ThreadPageClient({
  threadId, initialData
} : ThreadPageClientProps) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Comment[]>([]);
  
  const [newReply, setNewReply] = useState<string>("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isDeleteCommentReply, setIsDeleteCommentReply] = useState<boolean>(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  // Loading States
  const [isFetchingThread, setIsFetchingThread] = useState<boolean>(true);
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>(true);
  const [isFetchingReplies, setIsFetchingReplies] = useState<boolean>(false);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [isPostingReply, setIsPostingReply] = useState<boolean>(false);
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);

  // Error States
  const [fetchThreadError, setFetchThreadError] = useState<string | null>(null);
  const [fetchCommentsError, setFetchCommentsError] = useState<string | null>(null);
  const [fetchRepliesError, setFetchRepliesError] = useState<string | null>(null);
  const [postCommentError, setPostCommentError] = useState<string | null>(null);
  const [postReplyError, setPostReplyError] = useState<string | null>(null);
  const [deleteCommentError, setDeleteCommentError] = useState<string | null>(null);

  const [refreshComment, setRefreshComment] = useState<{
    refreshCount: number,
    commentId: number
  }>({
    refreshCount: 0,
    commentId: 0
  });

  // State Change Helpers
  const initializeData = async () => {
    if (initialData.thread.data) {
      setThread(initialData.thread.data);
    } else if (initialData.thread.error) {
      setFetchThreadError(initialData.thread.error);
    }
    setIsFetchingThread(false);

    if (initialData.comments.data && initialData.comments.data.length > 0) {
      setComments(initialData.comments.data);
      setSelectedCommentId(initialData.comments.data[0].id);
    } else if (initialData.comments.error) {
      setFetchCommentsError(initialData.comments.error);
    }
    setIsFetchingComments(false);
  };

  const handleChangeSelectedComment = (commentId: number) => {
    if (isFetchingReplies) return;
    setNewReply("");
    setFetchRepliesError(null);
    setPostReplyError(null);
    setIsPostingReply(false);
    setSelectedCommentId(commentId);
  }

  const handleClosePostCommentPopup = () => {
    setIsCommentPopupOpen(false);
    setIsPostingComment(false);
    setPostCommentError(null);
  }

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setIsDeletingComment(false);
    setDeleteCommentError(null);
    setIsDeleteCommentReply(false);
    setDeleteCommentId(null);
  }

  // REST API Helpers
  const fetchCommentById = async (commentId: number) => {
    setIsFetchingReplies(true);
    setFetchCommentsError(null);
    try {
      const response = await api.get(`/comments/${commentId}`);
      setIsFetchingReplies(false);
      return response.data;
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメント取得時にエラーが発生しました', err);
      setFetchCommentsError(err.response?.data?.error || 'コメント取得時にエラーが発生しました');
      setIsFetchingComments(false);
    }
  }

  const fetchReplies = async (commentId: number) => {
    setIsFetchingReplies(true);
    setFetchRepliesError(null);
    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      setReplies(response.data);
    } catch (err: any) {
      console.error(err.response?.data?.error || '返信取得時にエラーが発生しました', err);
      setFetchRepliesError(err.response?.data?.error || '返信取得時にエラーが発生しました');
    } finally {
      setIsFetchingReplies(false);
    }
  }

  const updateComment = async () => {
    const updatedComment = await fetchCommentById(refreshComment.commentId);
    if (updatedComment) {
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      )
    }
  }

  const handlePostComment = async (comment: string): Promise<boolean> => {
    setIsPostingComment(true);
    setPostCommentError(null);
    let isSuccess = true;
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content: comment
      });
      setComments([response.data, ...comments]);
      handleChangeSelectedComment(response.data.id);
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメント投稿時にエラーが発生しました', err);
      setPostCommentError(err.response?.data?.error || 'コメント投稿時にエラーが発生しました');
      isSuccess = false;
    } finally {
      setIsPostingComment(false);
      return isSuccess;
    }
  }

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

  const handleDeleteComment = async (commentId: number, isReply: boolean): Promise<boolean> => {
    setIsDeletingComment(true);
    setDeleteCommentError(null);
    let isSuccess = true;
    try {
      await api.delete(`/comments/${commentId}`);
      if (isReply) {
        setReplies(replies.filter((reply) => reply.id !== commentId));
        setRefreshComment((prev) => ({
          refreshCount: prev.refreshCount + 1,
          commentId: selectedCommentId ?? 0
        }));
      } else {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (err: any) {
      console.error(err.response?.data?.error || 'コメントの削除に失敗しました', err);
      setDeleteCommentError(err.response?.data?.error || 'コメントの削除に失敗しました');
      isSuccess = false;
    } finally {
      setIsDeletingComment(false);
      return isSuccess;
    }
  };

  // useEffect Hooks
  // SSRで取得したデータをstateにセット
  useEffect(() => {
    initializeData();
    console.log('initialData', initialData);
  }, [initialData]);

  // 選択コメントが変更されたらそのコメントへの返信を取得
  useEffect(() => {
    if (selectedCommentId) {
      fetchReplies(selectedCommentId);
    }
  }, [selectedCommentId])

  // 特定のコメント情報をリフレッシュする (いいねの後など)
  useEffect(() => {
    if (refreshComment.refreshCount > 0) {
      updateComment();
    };
  }, [refreshComment]);

  if (isFetchingThread) {
    return <LoadingScreen message="スレッドを読み込んでいます..." />
  }

  return (
    <div className="w-full">
      {!isFetchingThread && (
        <>
          {thread && (
            <ThreadHeader thread={thread} />
          )}
    
          {fetchThreadError && (
            <MessageBox type={MessageBoxType.ERROR} message={fetchThreadError} className="my-3" />
          )}
        </>
      )}

      <div className={`
        flex justify-start items-start gap-4 mt-4
        transition-all duration-300 w-full
      `}>
        {!isFetchingComments && (
          <div className="w-[50%] flex flex-col gap-4">
            {fetchCommentsError && (
              <MessageBox type={MessageBoxType.ERROR} message={fetchCommentsError} />
            )}

            {comments && comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                selectedCommentId={selectedCommentId}
                onClickShowReply={() => {
                  handleChangeSelectedComment(comment.id);
                }}
                onClickTrashButton={() => {
                  setDeleteCommentId(comment.id);
                  setIsDeleteCommentReply(false);
                  setIsDeletePopupOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {(() => {
          if (isFetchingReplies) return null;
          if (selectedCommentId === null) return null;

          return (
            <div className={`
              flex-1
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
                          setDeleteCommentId(reply.id);
                          setIsDeleteCommentReply(true);
                          setIsDeletePopupOpen(true);
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
        })()}
      </div>
      <button
        className="
          fixed bottom-4 left-4
          w-16 h-16
          bg-primary text-textcolor
          rounded-full shadow-md
          flex items-center justify-center
          hover:scale-110
          transition-all duration-200
          z-30
        "
        onClick={() =>setIsCommentPopupOpen(true)}
      >
        <FaComment size={28} />
      </button>
      {isCommentPopupOpen && typeof window !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <PostCommentPopup
              onClose={handleClosePostCommentPopup}
              handlePostComment={handlePostComment}
              isPostingComment={isPostingComment}
              postCommentError={postCommentError}
            />
          </div>
        </>,
        document.body
      )}
      {isDeletePopupOpen && typeof window !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <ConfirmationPopup
              type="delete"
              confirmMessage="コメントを削除しますか？"
              confirmLabel="削除"
              onConfirm={async () => {
                if (deleteCommentId === null) return false;
                return await handleDeleteComment(deleteCommentId, isDeleteCommentReply);
              }}
              onClose={handleCloseDeletePopup}
              isProcessing={isDeletingComment}
              processError={deleteCommentError}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
}