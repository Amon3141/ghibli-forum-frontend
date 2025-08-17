'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function EmailSentPage() {
  const { resendVerificationEmail, isSendingEmail } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleResendEmail = async () => {
    setMessage('');
    try {
      await resendVerificationEmail(email);
      setEmailSent(true);
      setMessage('確認メールを送信しました');
    } catch (error: any) {
      setMessage(error.response?.data?.error || '送信に失敗しました');
    }
  };

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const emailSentParam = searchParams.get('emailSent');
    
    if (!emailParam) {
      router.push('/auth/register');
      return;
    }
    
    setEmail(emailParam);
    setEmailSent(emailSentParam === 'true');
  }, [searchParams, router]);

  if (!email) {
    return (
      <LoadingScreen message="メールアドレスを取得中..." />
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          メール送信{emailSent ? '完了' : 'エラー'}
        </h1>

        <MessageBox
          type={emailSent ? MessageBoxType.Success : MessageBoxType.Error}
          message={emailSent 
            ? `${email} に確認メールを送信しました`
            : `${email} への確認メール送信に失敗しました`
          }
        />

        {message && (
          <MessageBox
            type={message.includes('送信しました') ? MessageBoxType.Success : MessageBoxType.Error}
            message={message}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <GeneralAsyncButton
            onClick={handleResendEmail}
            isLoading={isSendingEmail}
            loadingText="送信中..."
            mainText="確認メールを再送信"
          />

          <GeneralButton onClick={() => router.push('/auth/login')}>
            ログインページへ
          </GeneralButton>
        </div>

        <div className="small-text text-gray-600 space-y-1.5 mt-6">
          <p>• 迷惑メールも確認してください</p>
          <p>• 確認リンクの有効期限は24時間です</p>
          <p>• メール認証が完了するまでログインできません</p>
        </div>
      </div>
    </div>
  );
}