import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/utils/api';
import { User } from '@/types/database/user';

import { useAuth } from '@/contexts/AuthContext';
import useFileUpload from '@/hook/useImageUpload';

import GeneralButton from '@/components/ui/GeneralButton';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import ProfileItemCard, { ItemCardColor } from "@/components/features/user/ProfileItemCard";

import { MdOutlineAddAPhoto } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

interface ProfileHeaderProps {
  user: User;
  isEditing?: boolean | null;
  setIsEditing?: (isEditing: boolean) => void;
  transitionDuration?: number;
}

export default function ProfileHeader({ 
  user,
  isEditing = null,
  setIsEditing = () => {},
  transitionDuration = 1000
}: ProfileHeaderProps) {
  const { logout, setUser, isLoading } = useAuth();
  const { handleUploadFile } = useFileUpload();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(user.imagePath || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sasToken, setSasToken] = useState<string | null>(null);

  const profileImageType = ['image/png', 'image/jpeg', 'image/jpg'];

  const fetchSasToken = async (): Promise<string | null> => {
    try {
      const containerName = 'images';
      const res = await api.get(`/sas/token?containerName=${containerName}`);
      const { sasToken } = res.data;
      setSasToken(sasToken);
      return sasToken;
    } catch (err) {
      console.error('SASトークンの取得に失敗しました:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchSasToken();
  }, []);

  const handleSaveChanges = async () => {
    if (!selectedImage) {
      setIsEditing(false);
      return;
    }

    try {
      // 画像をAzure Storageにアップロード
      const result = await handleUploadFile(
        `profiles/${user.userId}/original.jpg`,
        selectedImage,
        profileImageType
      );
      if (!result) {
        throw new Error("画像のアップロードに失敗しました");
      }
      const { blobUrl, sasToken } = result;
      setSasToken(sasToken);

      // データベースのユーザー情報を更新
      const response = await api.put('/users/me', {
        imagePath: blobUrl || ''
      });

      if (response.data?.imagePath) {
        user.imagePath = response.data.imagePath;
        setUser({ ...user, imagePath: response.data.imagePath});
        setProfileImageUrl(response.data.imagePath);
      }
      setSelectedImage(null);
    } catch (error) {
      console.error("変更の保存に失敗しました: ", error);
      throw new Error(`変更の保存に失敗しました: ${error}`);
    } finally {
      setIsEditing(false);
    }
  }

  const profileImageIcon = () => {
    // 編集中で新しい画像を選択している場合
    if (isEditing && selectedImage) {
      const temporaryImageUrl = URL.createObjectURL(selectedImage);
      return (
        <Image 
          src={temporaryImageUrl}
          alt={user.username}
          fill
          className="bg-gray-200 object-contain"
        />
      )
    }
    // 通常時
    if (profileImageUrl && sasToken) {
      return (
        <Image
          src={`${profileImageUrl}?${sasToken}`} 
          alt={user.username}
          fill
          className="bg-gray-200 object-contain"
        />
      )
    }
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center">
        <span className="w-full h-full text-gray-500 text-3xl">
          {user.username?.[0]?.toUpperCase() ?? '?'}
        </span>
      </div>
    )
  }

  const selectImageOverlay = () => {
    return (
      <div
        className={`
          absolute inset-0 bg-black/20 flex items-center justify-center
          ${isEditing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all
        `}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      >
        <label className="
          cursor-pointer p-2.5 rounded-full
          bg-black/40 hover:bg-black/30 transition-all duration-200
        ">
          <MdOutlineAddAPhoto className="text-white/95 text-lg" />
          <input
            type="file"
            className="hidden"
            accept={profileImageType.join(', ')}
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const image = e.target.files[0];
                setSelectedImage(image);
              }
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <div className="
          flex-shrink-0 w-25 h-25 sm:w-33 sm:h-33
          rounded-full bg-gray-200 overflow-hidden relative
        ">
          {profileImageIcon()}
          {selectImageOverlay()}
        </div>
        {/* User Basic Info */}
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

            {/* Favourites */}
            {(user.favoriteCharacter || user.favoriteMovie) && (
              <div className="flex gap-2">
                {user.favoriteMovie && (
                  <ProfileItemCard
                    title = "好きな作品"
                    item = {user.favoriteMovie.title}
                    itemUrl = {`/movies/${user.favoriteMovie.id}`}
                    itemCardColor = {ItemCardColor.Amber}
                  />
                )}

                {user.favoriteCharacter && (
                  <ProfileItemCard
                    title = "好きなキャラクター"
                    item = {user.favoriteCharacter}
                    itemCardColor = {ItemCardColor.Orange}
                  />
                )}
              </div>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-textcolor/90 small-text leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* DaisyUI Dropdown */}
      {isEditing !== null && (
        <div tabIndex={0} className="absolute right-0 top-0 dropdown dropdown-bottom dropdown-end rounded-full bg-white shadow p-2">
          <BsThreeDots className="text-lg"/>
          <ul tabIndex={0} className="dropdown-content z-5 px-3 py-3 shadow rounded-box w-35 text-xs flex flex-col gap-1 bg-white/95 mt-2 font-bold text-textcolor">
            {!isEditing ? (
              <>
                <li>
                  <button 
                    onClick={async () => {
                      setIsEditing(true);
                    }}
                  >
                    プロフィールを編集
                  </button>
                </li>
                <li className="border-t border-gray-100 my-1"></li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-red-700"
                  >
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button 
                    onClick={async () => {
                      await handleSaveChanges();
                    }}
                  >
                    変更を保存
                  </button>
                </li>
                <li className="border-t border-gray-100 my-1"></li>
                <li>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setProfileImageUrl(user.imagePath || null);
                      setSelectedImage(null);
                    }}
                  >
                    キャンセル
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}