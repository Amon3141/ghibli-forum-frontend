'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import GeneralButton from '@/components/ui/GeneralButton';
import ProfileHeader from '@/components/features/user/ProfileHeader';

export default function ProfilePage() {
  const { user } = useAuth();
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
      <div className="flex flex-col w-full h-full py-6 px-8">
        <div 
          className={`
            transition-all ease-in-out
            ${showHeaderInCenter ? 'translate-y-[calc(30vh-50%)]' : 'translate-y-0'}
          `}
          style={{ transitionDuration: `${headerTransitionDuration}ms` }}
          onTransitionEnd={handleHeaderTransitionEnd}
        >
          <ProfileHeader user={user} isEditing={isEditing && showHeaderInCenter} setIsEditing={setIsEditing} transitionDuration={headerTransitionDuration} />
        </div>
        <div 
          className={`
            transition-all ease-in-out
            ${showMainContent ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          style={{ transitionDuration: `${mainContentTransitionDuration}ms` }}
          onTransitionEnd={handleMainContentTransitionEnd}
        >
          <div className="h-[1px] bg-gray-200 my-8" />
          <div className="h-full flex flex-col items-center">色々</div>
        </div>
      </div>
    )
  }
}