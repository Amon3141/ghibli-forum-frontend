'use client'
import { useEffect, useState } from 'react';

import ProfileHeader from '@/components/features/user/ProfileHeader';
import UserContents from '@/components/features/user/userContents';
import { useParams } from 'next/navigation';
import { User } from '@/types/database/user';
import { api } from '@/utils/api';
import GeneralButton from '@/components/ui/GeneralButton';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Link from 'next/link';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
      setIsLoading(false);
    }
    fetchUser();
  }, [userId]);
  
  if (isLoading) {
    return (
      <LoadingScreen message="ユーザー情報を読み込んでいます..." />
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-5 items-start">
          <h1>ユーザーが見つかりません</h1>
          <GeneralButton color="primary">
            <Link href="/">ホームに戻る</Link>
          </GeneralButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full py-6 px-8 space-y-8">
      <ProfileHeader user={user} />
      <UserContents user={user} />
    </div>
  )
}