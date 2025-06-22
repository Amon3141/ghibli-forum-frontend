'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Comment } from '@/types/comment';
import { User } from '@/types/user';

interface UserLikesProps {
  user: User;
}

export default function UserLikes({ user }: UserLikesProps) {
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      // TODO: Implement the API endpoint to fetch liked items
      // try {
      //   const response = await api.get(`/users/${userId}/likes`);
      //   setLikedItems(response.data);
      // } catch (err) {
      //   setError('いいねした項目の取得に失敗しました。');
      //   console.error(err);
      // }
      setLikedItems([]); // Placeholder
    };

    fetchLikes();
  }, [user.userId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (likedItems.length === 0) {
    return <p>まだいいねした項目はありません。</p>;
  }

  return (
    <div className="space-y-4">
      {/* TODO: Map over likedItems and render them */}
      <p>いいね機能は現在開発中です。</p>
    </div>
  );
}
