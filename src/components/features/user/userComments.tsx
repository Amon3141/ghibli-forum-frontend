'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Comment } from '@/types/comment';
import { User } from '@/types/user';
import CommentCardInProfile from '../post/CommentCardInProfile';

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

    fetchComments();
  }, [user.userId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (comments.length === 0) {
    return <p>まだコメントはありません。</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCardInProfile
          key={comment.id}
          comment={comment}
          commentType={commentType}
        />
      ))}
    </div>
  );
}
