import { User } from "@/types/user";

interface UsernameInlineProps {
  user?: User | null;
  textSize?: string;
}

export default function UsernameInline({ user = null, textSize = "text-sm" }: UsernameInlineProps) {
  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span>投稿者:</span>
      {user ? (
        <span className="flex items-center gap-1">
          <span className="font-bold">{user.username}</span>
          <span className="text-textcolor/80">@{user.userId}</span>
        </span>
      ) : (
        <span className="font-bold">無名さん</span>
      )}
    </div>
  );
}