'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isScreenSmOrLarger } from '@/utils/screenSize';

import GeneralButton from '@/components/ui/GeneralButton';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ProfileHeader from '@/components/features/user/profilePage/ProfileHeader';
import UserContents from '@/components/features/user/profilePage/UserContents';

export default function PrivateProfilePageClient() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showHeaderInCenter, setShowHeaderInCenter] = useState(false);
  const [showEditingHeader, setShowEditingHeader] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const prevIsEditing = useRef(isEditing);
  const headerTransitionDuration = 100;
  const mainContentTransitionDuration = 100;

  const handleMainContentTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (isEditing && e.propertyName == 'opacity') {
      setShowHeaderInCenter(true);
      if (!isScreenSmOrLarger()) { // for mobile
        setShowEditingHeader(true);
      }
    }
  }

  const handleHeaderTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isScreenSmOrLarger()) return;
    if (e.propertyName == 'translate') {
      if (isEditing) { // enter editing mode
        setShowEditingHeader(true);
      } else { // exit editing mode
        setShowMainContent(true);
      }
    }
  }

  useEffect(() => {
    if (prevIsEditing.current !== isEditing) {
      if (isEditing) { // enter editing mode
        setShowMainContent(false);
      } else { // exit editing mode
        setShowHeaderInCenter(false);
        setShowEditingHeader(false);
        if (!isScreenSmOrLarger()) { // for mobile
          setShowMainContent(true);
        }
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
    <div className="flex flex-col w-full h-full p-3">
      <div 
        className={`
          transition-all ease-in-out
          ${showHeaderInCenter ? 'translate-y-0 sm:translate-y-[calc(30vh-50%)]' : 'translate-y-0'}
        `}
        style={{ transitionDuration: `${headerTransitionDuration}ms` }}
        onTransitionEnd={handleHeaderTransitionEnd}
      >
        <ProfileHeader
          user={user}
          isEditing={isEditing && showHeaderInCenter}
          // showEditingHeader: switch to editing UI after translation is done
          // showHeaderInCenter: switch to editing UI when translation begins
          setIsEditing={setIsEditing}
          transitionDuration={headerTransitionDuration}
        />
      </div>
      <div 
        className={`
          transition-all ease-in-out mt-5 sm:mt-7 pb-5 sm:pb-6
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