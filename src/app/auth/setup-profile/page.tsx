'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import BasicProfileEditing from '@/components/features/user/profilePage/BasicProfileEditing';
import { User } from '@/types/database';
import LoadingScreen from '@/components/ui/LoadingScreen';
import useFileUpload from '@/hooks/useImageUpload';
import Image from 'next/image';
import { MdOutlineAddAPhoto } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';

export default function SetupProfilePage() {
  const { user, setUser, isLoading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  
  // 画像関連の状態
  const { handleUploadFile } = useFileUpload();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [sasToken, setSasToken] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const profileImageType = ['image/png', 'image/jpeg', 'image/jpg'];

  // SASトークンを取得
  const fetchSasToken = async (): Promise<string | null> => {
    try {
      const containerName = 'images';
      const res = await api.get(`/sas/token?containerName=${containerName}`);
      const { sasToken } = res.data;
      setSasToken(sasToken);
      return sasToken;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    fetchSasToken();
    if (user?.imagePath) {
      setProfileImageUrl(user.imagePath);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingScreen message="ユーザー情報を確認中..." />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!user.isFirstTimeLogin) {
    router.push('/');
    return null;
  }

  const handleUserUpdate = (updatedData: Partial<User>) => {
    setEditingUser(prev => ({ ...prev, ...updatedData }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');

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

      // データベース更新
      const updateData = {
        ...editingUser,
        isFirstTimeLogin: false
      };

      const response = await api.put('/users/me', updateData);

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        if (response.data.imagePath) {
          setProfileImageUrl(response.data.imagePath);
        }
        router.push('/');
      }
      setSelectedImage(null);
      setEditingUser({});
    } catch (error: any) {
      setError(error.response?.data?.error || 'プロフィールの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsSaving(true);
      
      const response = await api.put('/users/me', {
        isFirstTimeLogin: false
      });

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        router.push('/');
      }
      
    } catch (error: any) {
      setError('スキップに失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // プロフィール画像表示
  const profileImageIcon = () => {
    // 新しい画像を選択している場合
    if (selectedImage) {
      const temporaryImageUrl = URL.createObjectURL(selectedImage);
      return (
        <Image 
          src={temporaryImageUrl}
          alt={user.username}
          fill
          sizes="(max-width: 768px) 112px, 120px"
          className="bg-gray-200 object-cover"
        />
      );
    }
    // 既存の画像がある場合
    if (profileImageUrl && sasToken) {
      return (
        <Image
          src={`${profileImageUrl}?${sasToken}`} 
          alt={user.username}
          fill
          sizes="(max-width: 768px) 112px, 120px"
          className="bg-gray-200 object-cover"
        />
      );
    }
    // デフォルト表示
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
        {user.username?.[0]?.toUpperCase() ?? '?'}
      </div>
    );
  };

  // 画像選択オーバーレイ
  const selectImageOverlay = () => {
    return (
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 pointer-events-auto">
        <label className="cursor-pointer p-2.5 rounded-full bg-black/40 hover:bg-black/30 transition-all duration-200">
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
                
                // 少し遅延してローディング状態を表示
                setTimeout(() => {
                  setSelectedImage(image);
                  setIsLoadingImage(false);
                }, 1000);
              }
            }}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 max-w-[800px]">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-textcolor pb-1 text-center">
        ジブリ掲示板へようこそ！
      </h1>
      <p className="small-text text-textcolor/80 text-center">
        プロフィールを設定して始めよう
      </p>

      {/* Profile Setup Form */}
      <div className="
        bg-custom-white rounded-lg shadow-sm border border-gray-200 w-full
        my-2 px-4 sm:px-6 py-5 sm:py-6
      ">
        {/* Profile Image Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-7">
          <div className="
            flex-shrink-0 w-28 h-28 sm:w-30 sm:h-30
            rounded-full bg-gray-200 overflow-hidden relative
          ">
            {profileImageIcon()}
            {selectImageOverlay()}
          </div>
          <div className="flex-1 w-full">
            <BasicProfileEditing
              user={user}
              onUserUpdate={handleUserUpdate}
              onSave={handleSave}
              onCancel={undefined}
            />
          </div>
        </div>
        
        {/* Skip Option */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 text-center small-text">
          <p className="text-textcolor/60 mb-2">
            プロフィール設定は後からでも変更できます
          </p>
          <button
            onClick={handleSkip}
            disabled={isSaving}
            className="text-textcolor/70 hover:text-textcolor underline disabled:opacity-50"
          >
            {isSaving ? '処理中...' : 'スキップして始める'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3">
            <MessageBox type={MessageBoxType.Error} message={error} />
          </div>
        )}
      </div>
    </div>
  );
}