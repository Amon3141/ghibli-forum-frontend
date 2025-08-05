import { User } from "@/types/database/user";
import Link from "next/link";

interface UsernameInlineProps {
  user?: User | null;
  textSize?: string;
}

export default function UsernameInline({ user = null, textSize = "text-sm" }: UsernameInlineProps) {
  return (
    <Link
      href={`/profile/${user?.userId}`}
      className={`flex items-center gap-1 ${textSize}`}
    >
      {user ? (
        <span className="flex items-center small-text gap-[2px]">
          <span className="font-bold">{user.username}</span>
          <span className="font-bold">@{user.userId}</span>
        </span>
      ) : (
        <span className="font-bold small-text">無名さん</span>
      )}
    </Link>
  );
}