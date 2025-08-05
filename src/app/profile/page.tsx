'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import GeneralButton from '@/components/ui/GeneralButton';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ProfileHeader from '@/components/features/user/profilePage/ProfileHeader';
import UserContents from '@/components/features/user/profilePage/UserContents';

export default function PrivateProfilePageClient() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showHeaderInCenter, setShowHeaderInCenter] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const prevIsEditing = useRef(isEditing);
  const headerTransitionDuration = 1000;
  const mainContentTransitionDuration = 100;

  const handleMainContentTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (isEditing && e.propertyName == 'opacity') {
      setShowHeaderInCenter(true);
    }
  }

  const handleHeaderTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isEditing && e.propertyName == 'translate') {
      setShowMainContent(true);
    }
  }

  useEffect(() => {
    if (prevIsEditing.current !== isEditing) {
      if (isEditing) {
        setShowMainContent(false);
      } else {
        setShowHeaderInCenter(false);
      }
      prevIsEditing.current = isEditing;
    }
  }, [isEditing]);

  if (isLoading) {
    return (
      <LoadingScreen message="ユーザー情報を読み込んでいます..." />
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-sm sm:text-base">ログインしてください</h1>
          <GeneralButton>
            <Link href="/auth/login">ログイン</Link>
          </GeneralButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full py-3 px-2">
      <div 
        className={`
          transition-all ease-in-out
          ${showHeaderInCenter ? 'translate-y-[calc(30vh-50%)]' : 'translate-y-0'}
        `}
        style={{ transitionDuration: `${headerTransitionDuration}ms` }}
        onTransitionEnd={handleHeaderTransitionEnd}
      >
        <ProfileHeader
          user={user}
          isEditing={isEditing && showHeaderInCenter} 
          setIsEditing={setIsEditing}
          transitionDuration={headerTransitionDuration}
        />
      </div>
      <div 
        className={`
          transition-all ease-in-out mt-8 pb-6
          ${showMainContent ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{ transitionDuration: `${mainContentTransitionDuration}ms` }}
        onTransitionEnd={handleMainContentTransitionEnd}
      >
        <UserContents user={user} />
      </div>
    </div>
  )
}