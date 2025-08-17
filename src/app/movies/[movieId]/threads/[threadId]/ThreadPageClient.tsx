'use client';
import { useState, useEffect } from 'react';
import { api } from "@/utils/api";
import { useIsSm } from "@/hooks/useIsScreenWidth";
import { useAuth } from '@/contexts/AuthContext';
import { useLoginPopup } from '@/contexts/LoginPopupContext';
import { useRouter } from 'next/navigation';

import ThreadHeader from "@/components/features/thread/ThreadHeader";
import PostCommentPopup from "@/components/features/post/PostCommentPopup";
import ConfirmationPopup from "@/components/ui/ConfirmationPopup";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MessageBox from "@/components/ui/MessageBox";
import { MessageBoxType } from "@/types/types";
import { LoadedDataForThreadPage } from '@/types/ssr';
import RepliesBox, { RepliesBoxType } from "@/components/features/post/RepliesBox";
import CommentsBox from "@/components/features/post/CommentsBox";

import { FaComment } from "react-icons/fa6";

import { Thread } from "@/types/database";
import { Comment } from "@/types/database";
import Overlay from '@/components/ui/Overlay';

interface ThreadPageClientProps {
  threadId: number;
  initialData: LoadedDataForThreadPage;
}

export default function ThreadPageClient({
  threadId, initialData
} : ThreadPageClientProps) {
  const isSm = useIsSm();
  const { user } = useAuth();
  const { openLoginPopupWithMessage } = useLoginPopup();
  const router = useRouter();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);

  const [isPostCommentPopupOpen, setIsPostCommentPopupOpen] = useState<boolean>(false);
  const [isCommentDeletePopupOpen, setIsCommentDeletePopupOpen] = useState<boolean>(false);
  const [isDeleteCommentReply, setIsDeleteCommentReply] = useState<boolean>(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  const [isThreadDeletePopupOpen, setIsThreadDeletePopupOpen] = useState<boolean>(false);
  const [deleteThreadId, setDeleteThreadId] = useState<number | null>(null);

  // Loading States
  const [isFetchingThread, setIsFetchingThread] = useState<boolean>(true);
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>(true);
  const [isFetchingReplies, setIsFetchingReplies] = useState<boolean>(false);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
  const [isDeletingThread, setIsDeletingThread] = useState<boolean>(false);

  // Error States
  const [fetchThreadError, setFetchThreadError] = useState<string | null>(null);
  const [fetchCommentsError, setFetchCommentsError] = useState<string | null>(null);
  const [fetchRepliesError, setFetchRepliesError] = useState<string | null>(null);
  const [postCommentError, setPostCommentError] = useState<string | null>(null);
  const [deleteCommentError, setDeleteCommentError] = useState<string | null>(null);
  const [deleteThreadError, setDeleteThreadError] = useState<string | null>(null);

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
    setIsPostCommentPopupOpen(false);
    setIsPostingComment(false);
    setPostCommentError(null);
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
    if (!user) {
      openLoginPopupWithMessage('想いを共有しよう');
      return false;
    }
    setIsPostingComment(true);
    setPostCommentError(null);
    let isSuccess = true;
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content: comment,
        level: 1
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

  /* ----- Comment Deletion ----- */

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
        setSelectedCommentId(null);
      }
    } catch (err: any) {
      setDeleteCommentError(err.response?.data?.error || 'コメントの削除に失敗しました');
      isSuccess = false;
    } finally {
      setIsDeletingComment(false);
      return isSuccess;
    }
  }

  const onClickCommentTrashButton = async (commentId: number, isReply: boolean) => {
    setDeleteCommentId(commentId);
    setIsDeleteCommentReply(isReply);
    setIsCommentDeletePopupOpen(true);
  }

  const handleCloseCommentDeletePopup = () => {
    setIsCommentDeletePopupOpen(false);
    setIsDeletingComment(false);
    setDeleteCommentError(null);
    setIsDeleteCommentReply(false);
    setDeleteCommentId(null);
  }

  /* ----- Thread Deletion ----- */

  const handleDeleteThread = async (threadId: number): Promise<boolean> => {
    setIsDeletingThread(true);
    setDeleteThreadError(null);
    let isSuccess = true;
    try {
      await api.delete(`/threads/${threadId}`);
    } catch (err: any) {
      setDeleteThreadError(err.response?.data?.error || 'スレッドの削除に失敗しました');
      isSuccess = false;
    } finally {
      setIsDeletingThread(false);
      router.push(thread?.movieId ? `/movies/${thread?.movieId}` : '/');
      return isSuccess;
    }
  }

  const onClickThreadTrashButton = async (threadId: number) => {
    setDeleteThreadId(threadId);
    setIsThreadDeletePopupOpen(true);
  }

  const handleCloseDeleteThreadPopup = () => {
    setIsThreadDeletePopupOpen(false);
    setIsDeletingThread(false);
    setDeleteThreadError(null);
    setDeleteThreadId(null);
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
        onClickCommentTrashButton={(replyId) => onClickCommentTrashButton(replyId, true)}
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
    <div className="w-full max-w-[1000px] mb-2">
      {!isFetchingThread && (
        <div className="w-full space-y-3">
          {thread && (
            <ThreadHeader
              thread={thread}
              onClickThreadTrashButton={onClickThreadTrashButton}
            />
          )}
          {fetchThreadError && (
            <MessageBox type={MessageBoxType.Error} message={fetchThreadError} className="mb-3" />
          )}
        </div>
      )}

      <div className={`
        flex justify-start items-start gap-3 mt-2 sm:mt-3
        transition-all duration-300
      `}>
        {!isFetchingComments && (
          <div className={isSm ? "w-[50%]" : "w-full"}>
            <CommentsBox
              comments={comments}
              selectedCommentId={selectedCommentId}
              fetchCommentsError={fetchCommentsError}
              handleChangeSelectedComment={handleChangeSelectedComment}
              onClickCommentTrashButton={(commentId) => onClickCommentTrashButton(commentId, false)}
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
        onClick={() =>setIsPostCommentPopupOpen(true)}
      >
        <FaComment size={28} />
      </button>

      {isPostCommentPopupOpen && typeof window !== 'undefined' && (
        <Overlay zIndex={40}>
          <PostCommentPopup
              onClose={handleClosePostCommentPopup}
              handlePostComment={handlePostComment}
              isPostingComment={isPostingComment}
              postCommentError={postCommentError}
            />
        </Overlay>
      )}

      {isCommentDeletePopupOpen && typeof window !== 'undefined' && (
        <Overlay zIndex={40}>
          <ConfirmationPopup
              type="delete"
              confirmMessage="コメントを削除しますか？"
              confirmLabel="削除"
              onConfirm={async () => {
                if (deleteCommentId === null) return false;
                return await handleDeleteComment(deleteCommentId, isDeleteCommentReply);
              }}
              onClose={handleCloseCommentDeletePopup}
              isProcessing={isDeletingComment}
              processError={deleteCommentError}
            />
        </Overlay>
      )}
      {isThreadDeletePopupOpen && typeof window !== 'undefined' && (
        <Overlay zIndex={40}>
          <ConfirmationPopup
              type="delete"
              confirmMessage="本当にスレッドを削除しますか？"
              confirmLabel="削除"
              onConfirm={async () => {
                if (deleteThreadId === null) return false;
                return await handleDeleteThread(deleteThreadId);
              }}
              onClose={handleCloseDeleteThreadPopup}
              isProcessing={isDeletingThread}
              processError={deleteThreadError}
            />
        </Overlay>
      )}
    </div>
  );
}