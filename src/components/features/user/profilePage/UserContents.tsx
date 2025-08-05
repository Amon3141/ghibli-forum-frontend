'use client';

import { useState } from 'react';
import UserComments from './UserComments';
import UserLikes from '@/components/features/user/profilePage/UserLikes';
import { User } from '@/types/database/user';

interface UserContentsProps {
  user: User;
}

export default function UserContents({ user }: UserContentsProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'replies' | 'likes'>('comments');

  if (!user) {
    return null;
  }

  const tabButtonStyle = "pb-2 border-b-2 transition-colors duration-300";
  const activeTabButtonStyle = "border-stone-700 text-stone-800";
  const inactiveTabButtonStyle = "border-transparent text-gray-500 hover:text-stone-700";

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 space-x-4">
        <button
          className={`${tabButtonStyle} ${activeTab === 'comments' ? activeTabButtonStyle : inactiveTabButtonStyle}`}
          onClick={() => setActiveTab('comments')}
        >
          コメント
        </button>
        <button
          className={`${tabButtonStyle} ${activeTab === 'replies' ? activeTabButtonStyle : inactiveTabButtonStyle}`}
          onClick={() => setActiveTab('replies')}
        >
          リプライ
        </button>
        <button
          className={`${tabButtonStyle} ${activeTab === 'likes' ? activeTabButtonStyle : inactiveTabButtonStyle}`}
          onClick={() => setActiveTab('likes')}
        >
          いいね
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'comments' && <UserComments user={user} commentType="comments" />}
        {activeTab === 'replies' && <UserComments user={user} commentType="replies" />}
        {activeTab === 'likes' && <UserLikes user={user} />}
      </div>
    </div>
  );
}
