'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsSm } from '@/hooks/useIsScreenWidth';
import { useRouter } from 'next/navigation';

import LoadingScreen from '@/components/ui/LoadingScreen';
import ProfileHeader from '@/components/features/user/profilePage/ProfileHeader';
import UserContents from '@/components/features/user/profilePage/UserContents';

export default function PrivateProfilePage() {
  const isSm = useIsSm();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showHeaderInCenter, setShowHeaderInCenter] = useState(false);
  const [showEditingHeader, setShowEditingHeader] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const prevIsEditing = useRef(isEditing);
  const headerTransitionDuration = 100;
  const mainContentTransitionDuration = 500;

  const handleMainContentTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (isEditing && e.propertyName == 'opacity') {
      setShowHeaderInCenter(true);
      if (!isSm) { // for mobile
        setShowEditingHeader(true);
      }
    }
  }

  const handleHeaderTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isSm) return;
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
        if (!isSm) { // for mobile
          setShowMainContent(true);
        }
      }
      prevIsEditing.current = isEditing;
    }
  }, [isEditing]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <LoadingScreen message="ユーザー情報を読み込んでいます..." />
    );
  }

  if (!user) {
    router.replace('/auth/login');
    return (
      <LoadingScreen message="ログインページにリダイレクトしています..." />
    )
  }

  return (
    <div className="flex flex-col w-full max-w-[800px] h-full p-3">
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
          isPublicProfile={false}
          setIsEditing={setIsEditing}
          transitionDuration={headerTransitionDuration}
        />
      </div>
      <div 
        className={`
          transition-all ease-in-out mt-3 sm:mt-4 pb-5 sm:pb-6
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