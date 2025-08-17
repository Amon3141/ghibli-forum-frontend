'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InputField from '@/components/ui/InputField';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();
  const { requestPasswordReset, isSendingEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      await requestPasswordReset(email);
      setMessage('パスワードリセットメールを送信しました');
      setIsSuccess(true);
    } catch (error: any) {
      setMessage(error.message || 'パスワードリセット要求に失敗しました');
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-full flex items-center justify-center p-4 mb-5">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-5">
            メール送信完了
          </h1>

          <MessageBox
            type={MessageBoxType.Success}
            message={message}
          />

          <div className="flex justify-end">
            <GeneralButton onClick={() => router.push('/auth/login')}>
              ログインページへ
            </GeneralButton>
          </div>

          <div className="small-text text-gray-600 space-y-1 mt-6">
            <p>• 迷惑メールも確認してください</p>
            <p>• リセットリンクの有効期限は24時間です</p>
            <p>• メールが届かない場合は、メールアドレスを確認してください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4 w-full max-w-md mb-5">
      <div className="w-full space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
          パスワードをリセット
        </h1>

        <p className="small-text text-gray-600 text-center mb-6 mx-auto">
          登録したメールアドレスを入力してください
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
          />

          <div className="flex items-center justify-between gap-3">
            <GeneralButton onClick={() => router.push('/auth/login')}>
              戻る
            </GeneralButton>
            
            <GeneralAsyncButton
              type="submit"
              isLoading={isSendingEmail}
              loadingText="送信中..."
              mainText="リセットメールを送信"
            />
          </div>
        </form>

        {message && !isSuccess && (
          <MessageBox
            type={MessageBoxType.Error}
            message={message}
          />
        )}
      </div>
    </div>
  );
}
