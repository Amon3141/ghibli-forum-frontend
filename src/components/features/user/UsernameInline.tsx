import { User } from "@/types/user";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface UsernameInlineProps {
  user?: User | null;
  textSize?: string;
}

export default function UsernameInline({ user = null, textSize = "text-sm" }: UsernameInlineProps) {
  const { user: currentUser } = useAuth();
  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span>投稿者:</span>
      <Link href={`/profile${currentUser?.userId === user?.userId ? '' : `/${user?.userId}`}`}>
        {user ? (
          <span className="flex items-center gap-1">
            <span className="font-bold">{user.username}</span>
            <span className="text-textcolor/80">@{user.userId}</span>
          </span>
        ) : (
          <span className="font-bold">無名さん</span>
        )}
      </Link>
    </div>
  );
}