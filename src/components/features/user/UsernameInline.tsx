import { User } from "@/types/database";
import Link from "next/link";

interface UsernameInlineProps {
  user?: User | null;
  textSize?: string;
}

export default function UsernameInline({ user = null, textSize = "small-text" }: UsernameInlineProps) {
  return (
    <Link
      href={`/profile/${user?.userId}`}
      className={`flex items-center gap-1 ${textSize}`}
    >
      {user ? (
        <span className="flex items-center gap-[2px]">
          <span>{user.username}</span>
          <span>@{user.userId}</span>
        </span>
      ) : (
        <span>無名さん</span>
      )}
    </Link>
  );
}