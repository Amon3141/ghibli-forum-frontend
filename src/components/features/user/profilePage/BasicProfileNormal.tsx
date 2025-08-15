import { User } from "@/types/database";
import AdminIcon from "../AdminIcon";

interface BasicProfileNormalProps {
  user: User;
}

/**
 * プロフィール情報 (編集していない時)
 */
export default function BasicProfileNormal({ user }: BasicProfileNormalProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-4">
        {/* Username */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex items-end gap-2.5">
            <p className="text-2xl sm:text-3xl -ml-1">{user.username ?? '無名さん'}</p>
            {user.isAdmin && (
              <AdminIcon />
            )}
          </div>
          <p className="text-textcolor/80 small-text">@{user.userId ?? '不明'}</p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-textcolor/90 small-text leading-relaxed">
          {user.bio}
        </p>
      )}
    </div>
  )
}