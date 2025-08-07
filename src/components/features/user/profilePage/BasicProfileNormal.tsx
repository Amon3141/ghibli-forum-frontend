import { User } from "@/types/database/user";
import ProfileItemCard from "./ProfileItemCard";
import { ItemCardColor } from "./ProfileItemCard";

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
          <div className="flex items-end gap-2">
            <p className="text-2xl sm:text-3xl">{user.username ?? '無名さん'}</p>
            {user.isAdmin && (
              <div className="
                px-1 sm:px-1.5 py-0.5 mb-1.25 rounded-sm
                text-[0.6rem] sm:text-[0.7rem] text-white bg-textcolor/85 whitespace-nowrap
                flex items-center justify-center
              ">管理者</div>
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