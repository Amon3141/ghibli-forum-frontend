'use client'
import ProfileHeader from '@/components/features/user/profilePage/ProfileHeader';
import UserContents from '@/components/features/user/profilePage/UserContents';
import { User } from '@/types/database';

interface PublicProfilePageClientProps {
  user: User;
}

export default function PublicProfilePageClient({ user }: PublicProfilePageClientProps) {

  return (
    <div className="flex flex-col w-full max-w-[1000px] h-full py-6 px-8 space-y-8">
      <ProfileHeader
        user={user}
        isEditing={false}
        isPublicProfile={true}
      />
      <UserContents user={user} />
    </div>
  )
}
