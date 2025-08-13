'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from "@/utils/api";
import { useIsSm } from "@/hook/useIsScreenWidth";

import ThreadHeader from "@/components/features/thread/ThreadHeader";
import PostCommentPopup from "@/components/features/post/CommentPopup";
import ConfirmationPopup from "@/components/ui/ConfirmationPopup";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MessageBox from "@/components/ui/MessageBox";
import { MessageBoxType } from "@/types/MessageBoxType";
import { LoadedDataForThreadPage } from '@/types/loadedData';
import RepliesBox, { RepliesBoxType } from "@/components/features/post/RepliesBox";
import CommentsBox from "@/components/features/post/CommentsBox";

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
  const isSm = useIsSm();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);

  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isDeleteCommentReply, setIsDeleteCommentReply] = useState<boolean>(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  // Loading States
  const [isFetchingThread, setIsFetchingThread] = useState<boolean>(true);
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>(true);
  const [isFetchingReplies, setIsFetchingReplies] = useState<boolean>(false);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);

  // Error States
  const [fetchThreadError, setFetchThreadError] = useState<string | null>(null);
  const [fetchCommentsError, setFetchCommentsError] = useState<string | null>(null);
  const [fetchRepliesError, setFetchRepliesError] = useState<string | null>(null);
  const [postCommentError, setPostCommentError] = useState<string | null>(null);
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
      handleChangeSelectedComment(initialData.comments.data[0].id);
    } else if (initialData.comments.error) {
      setFetchCommentsError(initialData.comments.error);
    }
    setIsFetchingComments(false);
  };

  const handleChangeSelectedComment = (newCommentId: number) => {
    if (!isFetchingReplies && newCommentId !== selectedCommentId) {
      setFetchRepliesError(null);
      fetchReplies(newCommentId);
      setSelectedCommentId(newCommentId);
    }
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
      setPostCommentError(err.response?.data?.error || 'コメント投稿時にエラーが発生しました');
      isSuccess = false;
    } finally {
      setIsPostingComment(false);
      return isSuccess;
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
      setDeleteCommentError(err.response?.data?.error || 'コメントの削除に失敗しました');
      isSuccess = false;
    } finally {
      setIsDeletingComment(false);
      return isSuccess;
    }
  };

  const onClickCommentTrashButton = async (replyId: number) => {
    setDeleteCommentId(replyId);
    setIsDeleteCommentReply(true);
    setIsDeletePopupOpen(true);
  }

  const renderRepliesBox = (commentId: number, type: RepliesBoxType) => {
    return (
      <RepliesBox
        type={type}
        threadId={threadId}
        replies={replies}
        setReplies={setReplies}
        selectedCommentId={commentId}
        fetchRepliesError={fetchRepliesError}
        setRefreshComment={setRefreshComment}
        onClickCommentTrashButton={onClickCommentTrashButton}
        setIsFetchingReplies={setIsFetchingReplies}
      />
    )
  }

  // useEffect Hooks
  // SSRで取得したデータをstateにセット
  useEffect(() => {
    initializeData();
  }, [initialData]);

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
    <div className="w-full max-w-[1000px] my-3">
      {!isFetchingThread && (
        <>
          {thread && (
            <ThreadHeader thread={thread} />
          )}
          {fetchThreadError && (
            <MessageBox type={MessageBoxType.Error} message={fetchThreadError} className="my-3" />
          )}
        </>
      )}

      <div className={`
        flex justify-start items-start gap-4 mt-4
        transition-all duration-300
      `}>
        {!isFetchingComments && (
          <div className={isSm ? "w-[50%]" : "w-full"}>
            <CommentsBox
              comments={comments}
              selectedCommentId={selectedCommentId}
              fetchCommentsError={fetchCommentsError}
              handleChangeSelectedComment={handleChangeSelectedComment}
              onClickCommentTrashButton={onClickCommentTrashButton}
              renderRepliesBox={renderRepliesBox}
            />
          </div>
        )}

        {isSm && (selectedCommentId != null && !isFetchingReplies) && (
          <div className="flex-1 sticky top-0">
            {renderRepliesBox(selectedCommentId, RepliesBoxType.Side)}
          </div>
        )}
      </div>
      <button
        className="
          fixed bottom-4 left-4
          w-16 h-16 z-30
          bg-primary text-textcolor
          rounded-full shadow-md
          flex items-center justify-center
          popup-element
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