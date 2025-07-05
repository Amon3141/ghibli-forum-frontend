import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/database/user';
import { useEffect, useState } from 'react';
import useFileUpload from '@/hook/useImageUpload';
import { api } from '@/utils/api';
import { MdOutlineAddAPhoto } from "react-icons/md";
import GeneralButton from '@/components/ui/GeneralButton';

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
  const { logout, setUser } = useAuth();
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
        <img 
          src={temporaryImageUrl} 
          alt={user.username}
          className="w-full h-full bg-gray-200 object-cover"
        />
      )
    }
    // 通常時
    if (profileImageUrl && sasToken) {
      return (
        <img 
          src={`${profileImageUrl}?${sasToken}`} 
          alt={user.username}
          className="w-full h-full bg-gray-200 object-cover"
        />
      )
    }
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500 text-3xl">
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

  const optionButtonsNormal = (
    <div className={`
      absolute right-0
      flex flex-col items-end gap-8
      ${isEditing ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
      transition-all duration-${transitionDuration}
    `}>
      <GeneralButton
        className="text-sm"
        onClick={logout}
      >
        ログアウト
      </GeneralButton>

      <GeneralButton
      className="text-sm rounded-full"
        onClick={async () => {
          setIsEditing(true);
        }}
      >
        プロフィールを編集
      </GeneralButton>
    </div>
  );

  const optionButtonsEditing = (
    <div className={`
      absolute right-0
      flex items-center gap-2
      ${isEditing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      transition-all duration-${transitionDuration}
    `}>
      <GeneralButton
        className="text-sm rounded-full"
        onClick={async () => {
          await handleSaveChanges();
        }}
      >
        変更を保存
      </GeneralButton>
      <GeneralButton
        className="text-sm rounded-full"
        onClick={() => {
          setIsEditing(false);
          setProfileImageUrl(user.imagePath || null);
          setSelectedImage(null);
        }}
      >
        キャンセル
      </GeneralButton>
    </div>
  );

  return (
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-5">
        <div className="w-23 h-23 rounded-full bg-gray-200 overflow-hidden relative">
          {profileImageIcon()}
          {selectImageOverlay()}
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-end gap-2">
            <p className="text-3xl">{user.username ?? '無名さん'}</p>
            {user.isAdmin && (
              <div className="
                px-1.5 py-0.5 mb-1.25 rounded-sm
                text-[0.7rem] text-white bg-textcolor/85
                flex items-center justify-center
              ">管理者</div>
            )}
          </div>
          <p className="text-textcolor/80 text-sm">@{user.userId ?? '不明'}</p>
        </div>
      </div>
      
      {isEditing !== null &&
        <>
          {optionButtonsNormal}
          {optionButtonsEditing}
        </>
      }
    </div>
  );
}