import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/utils/api';
import { User } from '@/types/database/user';

import { useAuth } from '@/contexts/AuthContext';
import useFileUpload from '@/hook/useImageUpload';

import { MdOutlineAddAPhoto } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BasicProfileNormal from './BasicProfileNormal';
import BasicProfileEditing from './BasicProfileEditing';
import ProfileItemCard, { ItemCardColor } from './ProfileItemCard';

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  transitionDuration?: number;
}

export default function ProfileHeader({ 
  user,
  isEditing = false,
  setIsEditing,
  transitionDuration = 1000
}: ProfileHeaderProps) {
  const { logout, setUser } = useAuth();
  const { handleUploadFile } = useFileUpload();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(user.imagePath || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sasToken, setSasToken] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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
    try {
      // 画像をAzure Storageにアップロード
      if (selectedImage) {
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
        editingUser.imagePath = blobUrl || '';
      }

      // データベースのユーザー情報を更新
      const response = await api.put('/users/me', editingUser);

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        if (response.data.imagePath) {
          setProfileImageUrl(response.data.imagePath);
        }
      }
      setSelectedImage(null);
      setEditingUser({});
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
          sizes="100vw"
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
          sizes="100vw"
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
          {isLoadingImage ? (
            <AiOutlineLoading3Quarters className="text-white/95 text-lg animate-spin" />
          ) : (
            <MdOutlineAddAPhoto className="text-white/95 text-lg" />
          )}
          <input
            type="file"
            className="hidden"
            accept={profileImageType.join(', ')}
            disabled={isLoadingImage}
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                setIsLoadingImage(true);
                const image = e.target.files[0];
                
                // Small delay to show the loading state
                setTimeout(() => {
                  setSelectedImage(image);
                  setIsLoadingImage(false);
                }, 2000);
              }
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-7">
        {/* Profile Image */}
        <div className="
          flex-shrink-0 w-28 h-28 sm:w-30 sm:h-30
          rounded-full bg-gray-200 overflow-hidden relative
        ">
          {profileImageIcon()}
          {selectImageOverlay()}
        </div>
        
        <div className='flex-1 w-full'>
          {isEditing ? (
            <BasicProfileEditing 
              user={user} 
              onUserUpdate={setEditingUser}
              onSave={handleSaveChanges}
              onCancel={() => {
                setIsEditing(false);
                setProfileImageUrl(user.imagePath || null);
                setSelectedImage(null);
                setEditingUser({});
                setIsLoadingImage(false);
              }}
            />
          ) : (
            <BasicProfileNormal user={user} />
          )}
        </div>
      </div>
      
      {/* Favourites */}
      {!isEditing && (
        <div className="flex gap-2.5 mt-4 sm:mt-5 sm:mt-7">
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

      {/* Option Button Dropdown */}
      {!isEditing && (
        <div tabIndex={0} className="absolute right-0 top-0 dropdown dropdown-bottom dropdown-end rounded-full bg-white shadow p-2 cursor-pointer">
          <BsThreeDots className="text-lg"/>
          <ul tabIndex={0} className="dropdown-content z-5 px-3 py-3 shadow rounded-box w-35 text-xs flex flex-col gap-1 bg-white/95 mt-2 font-bold text-textcolor">
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
          </ul>
        </div>
      )}
    </div>
  );
}