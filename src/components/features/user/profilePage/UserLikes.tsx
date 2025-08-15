'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { User } from '@/types/database';
import CommentCardInProfilePage from '@/components/features/post/CommentCardInProfilePage';

interface UserLikesProps {
  user: User;
}

export default function UserLikes({ user }: UserLikesProps) {
  const [likedComments, setLikedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (likedComments.length === 0) {
    return <p>まだいいねした項目はありません。</p>;
  }

  return (
    <div className="space-y-3">
      {likedComments.map((comment) => {
        if (comment) {
          return (
            <CommentCardInProfilePage
              key={comment.id}
              comment={comment}
            />
          );
        }
      })}
    </div>
  );
}
