'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { User } from '@/types/user';
import CommentCardInProfilePage from '../post/CommentCardInProfile';

interface UserLikesProps {
  user: User;
}

export default function UserLikes({ user }: UserLikesProps) {
  const [likedComments, setLikedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedComments = async () => {
      try {
        const response = await api.get(`/users/${user.id}/reactions/comments`);
        setLikedItems(response.data);
      } catch (err) {
        setError('いいねした項目の取得に失敗しました。');
        console.error(err);
      }
    };
    fetchLikedComments();
  }, [user.id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (likedComments.length === 0) {
    return <p>まだいいねした項目はありません。</p>;
  }

  return (
    <div className="space-y-4">
      {likedComments.map((comment) => (
        <CommentCardInProfilePage
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}
