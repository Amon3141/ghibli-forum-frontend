'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Comment } from '@/types/database';
import { User } from '@/types/database';
import CommentCardInProfilePage from '@/components/features/post/CommentCardInProfilePage';

interface UserCommentsProps {
  user: User;
  commentType: 'comments' | 'replies';
}

export default function UserComments({ user, commentType }: UserCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/users/${user.id}/comments`);
        const filteredComments = response.data.filter((comment: Comment) => {
          if (commentType === 'comments') {
            return !comment.parentId;
          } else if (commentType === 'replies') {
            return comment.parentId;
          }
          return false;
        });
        setComments(filteredComments);
      } catch (err) {
        setError('コメントの取得に失敗しました。');
        console.error(err);
      }
    };

    if (user.id) {
      fetchComments();
    }
  }, [user.id, commentType]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (comments.length === 0) {
    return <p>まだコメントはありません。</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        if (comment) {
          return (
            <CommentCardInProfilePage
              key={comment.id}
              comment={comment}
          />
        )}
      })}
    </div>
  );
}
