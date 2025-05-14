'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

import GeneralButton from '@/components/ui/GeneralButton';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-4 items-start">
          <h1>ログインしてください</h1>
          <GeneralButton>
            <Link href="/auth/login">ログイン</Link>
          </GeneralButton>
        </div>
      </div>
    )
  } else {
    return (
      <div className="space-y-6 w-full">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold py-2">マイページ</h2>
          <div className="flex flex-col items-start gap-1">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl">{user.username ?? '不明'}</p>
                {user.isAdmin && (
                  <div className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center justify-center" style={{ height: '80%' }}>管理者</div>
                )}
              </div>
              <p className="text-textcolor/80">@{user.userId ?? '不明'}</p>
            </div>
            <p className="text-lg">{user.email ?? '不明'}</p>
          </div>
        </div>
        <GeneralButton onClick={logout}>ログアウト</GeneralButton>
      </div>
    )
  }
}