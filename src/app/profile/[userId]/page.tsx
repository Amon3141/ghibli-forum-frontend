import PublicProfilePageClient from './PublicProfilePageClient';
import { User } from '@/types/database';
import GeneralButton from '@/components/ui/GeneralButton';
import Link from 'next/link';
import { api } from '@/utils/api';

interface PublicProfilePageProps {
  params: {
    userId: string;
  };
}

async function getUserData(userId: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { userId } = params;
  const user = await getUserData(userId);

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
    );
  }

  return (
    <PublicProfilePageClient user={user} />
  );
}