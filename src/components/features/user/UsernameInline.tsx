import { User } from "@/types/database";
import Link from "next/link";
import router from "next/router";

interface UsernameInlineProps {
  user?: User | null;
  textSize?: string;
}

export default function UsernameInline({ user = null, textSize = "small-text" }: UsernameInlineProps) {
  return (
    <div
      className={`flex items-center gap-1 ${textSize}`}
      onClick={() => {
        if (user) {
          router.push(`/profile/${user.userId}`);
        }
      }}
    >
      {user ? (
        <span className="flex items-center gap-[2px]">
          <span>{user.username}</span>
          <span>@{user.userId}</span>
        </span>
      ) : (
        <span>無名さん</span>
      )}
    </div>
  );
}