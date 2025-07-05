import { User } from '@/types/database/user';
import ProfileIcon from './ProfileIcon';
import Link from 'next/link';

interface UsernameIconProps {
  user?: User | null;
}

export default function UsernameIcon({ user = null }: UsernameIconProps) {
  if (!user) {
    return (
      <p className="font-bold">無名さん</p>
    );
  }
  return (
    <Link
      href={`/profile/${user?.userId}`}
      className="flex items-center gap-[7px]"
    >
      <ProfileIcon user={user} size={38} />
      <div className="flex flex-col items-start">
        <p className="font-bold leading-[1.3] pl-[1px]">{user.username ?? '無名さん'}</p>
        <p className="text-xs text-textcolor/80">@{user.userId ?? '不明'}</p>
      </div>
    </Link>
  );
}