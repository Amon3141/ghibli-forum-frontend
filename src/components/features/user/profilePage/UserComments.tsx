'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Comment } from '@/types/database';
import { User } from '@/types/database';
import CommentCardInProfilePage from '@/components/features/post/CommentCardInProfilePage';
import Overlay from '@/components/ui/Overlay';
import ConfirmationPopup from '@/components/ui/ConfirmationPopup';

interface UserCommentsProps {
  user: User;
  commentType: 'comments' | 'replies';
}

export default function UserComments({ user, commentType }: UserCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchCommentsError, setFetchCommentsError] = useState<string | null>(null);

  const [isCommentDeletePopupOpen, setIsCommentDeletePopupOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [deleteCommentError, setDeleteCommentError] = useState<string | null>(null);

  const handleDeleteComment = async (commentId: number): Promise<boolean> => {
    setIsDeletingComment(true);
    setDeleteCommentError(null);
    let isSuccess = true;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      setDeleteCommentError(err.response?.data?.error || 'コメントの削除に失敗しました');
      isSuccess = false;
    } finally {
      setIsDeletingComment(false);
      return isSuccess;
    }
  }

  const onClickCommentTrashButton = async (commentId: number) => {
    setDeleteCommentId(commentId);
    setIsCommentDeletePopupOpen(true);
  }

  const handleCloseCommentDeletePopup = () => {
    setIsCommentDeletePopupOpen(false);
    setIsDeletingComment(false);
    setDeleteCommentError(null);
    setDeleteCommentId(null);
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/users/${user.id}/comments`);
        const filteredComments = response.data.filter((comment: Comment) => {
          if (commentType === 'comments') {
            return comment.level === 1;
          } else if (commentType === 'replies') {
            return comment.level === 2;
          }
          return false;
        });
        setComments(filteredComments);
      } catch (err) {
        setFetchCommentsError('コメントの取得に失敗しました。');
      }
    };

    if (user.id) {
      fetchComments();
    }
  }, [user.id, commentType]);

  if (fetchCommentsError) {
    return <p className="text-red-700">{fetchCommentsError}</p>;
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">まだコメントはありません。</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        if (comment) {
          return (
            <CommentCardInProfilePage
              key={comment.id}
              comment={comment}
              onClickTrashButton={onClickCommentTrashButton}
          />
        )}
      })}
      {isCommentDeletePopupOpen && typeof window !== 'undefined' && (
        <Overlay zIndex={40}>
          <ConfirmationPopup
              type="delete"
              confirmMessage="コメントを削除しますか？"
              confirmLabel="削除"
              onConfirm={async () => {
                if (deleteCommentId === null) return false;
                return await handleDeleteComment(deleteCommentId);
              }}
              onClose={handleCloseCommentDeletePopup}
              isProcessing={isDeletingComment}
              processError={deleteCommentError}
            />
        </Overlay>
      )}
    </div>
  );
}
