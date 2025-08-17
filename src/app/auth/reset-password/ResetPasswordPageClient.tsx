'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IoEye, IoEyeOff } from "react-icons/io5";
import InputField from '@/components/ui/InputField';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface ResetPasswordPageClientProps {
  token: string | null;
}

export default function ResetPasswordPageClient({ token }: ResetPasswordPageClientProps) {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { resetPassword, isLoading } = useAuth();

  // トークンがない場合の処理
  if (!token) {
    return (
      <div className="h-full flex items-center justify-center p-4 w-full max-w-md">
        <div className="w-full space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
            無効なリンク
          </h1>
          
          <MessageBox
            type={MessageBoxType.Error}
            message="パスワードリセットトークンが見つかりません。"
          />
          
          <div className="flex justify-center">
            <GeneralButton onClick={() => router.push('/auth/forgot-password')}>
              パスワードリセットページへ
            </GeneralButton>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitPasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setMessage('パスワードを入力してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('パスワードが一致しません');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('パスワードは6文字以上である必要があります');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage('パスワードが正常に更新されました。新しいパスワードでログインしてください。');
      setIsSuccess(true);
    } catch (error: any) {
      setMessage(error.message || 'パスワードリセットに失敗しました');
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-full flex items-center justify-center p-4 w-full max-w-md mb-5">
        <div className="w-full space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-5">
            パスワード変更完了
          </h1>

          <MessageBox
            type={MessageBoxType.Success}
            message={message}
          />

          <div className="flex justify-center">
            <GeneralButton onClick={() => router.push('/auth/login')}>
              ログインページへ
            </GeneralButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4 w-full max-w-md mb-5">
      <div className="w-full space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6">
          新しいパスワードを設定
        </h1>

        <form onSubmit={handleSubmitPasswordReset} className="space-y-4">
          <div className="relative w-full">
            <InputField
              type={isPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新しいパスワード"
            />
            <span
              className="absolute inset-y-0 right-2 flex items-center px-1 cursor-pointer text-textcolor/80"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              role="button"
              aria-label={isPasswordVisible ? "パスワードを非表示" : "パスワードを表示"}
            >
              {isPasswordVisible ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>

          <div className="relative w-full">
            <InputField
              type={isConfirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="新しいパスワード（確認用）"
            />
            <span
              className="absolute inset-y-0 right-2 flex items-center px-1 cursor-pointer text-textcolor/80"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              role="button"
              aria-label={isConfirmPasswordVisible ? "パスワードを非表示" : "パスワードを表示"}
            >
              {isConfirmPasswordVisible ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <GeneralButton onClick={() => router.push('/auth/login')}>
              キャンセル
            </GeneralButton>
            
            <GeneralAsyncButton
              type="submit"
              isLoading={isLoading}
              loadingText="更新中..."
              mainText="パスワードを更新"
            />
          </div>
        </form>

        {message && !isSuccess && (
          <MessageBox
            type={MessageBoxType.Error}
            message={message}
          />
        )}

        <div className="small-text text-gray-600 space-y-1 mt-6">
          <p>• パスワードは6文字以上で設定してください</p>
          <p>• 英数字を組み合わせることをお勧めします</p>
        </div>
      </div>
    </div>
  );
}
