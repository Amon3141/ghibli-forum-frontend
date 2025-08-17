'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { PageStatus } from '@/types/types';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { resendVerificationEmail, isSendingEmail } = useAuth();

  const [status, setStatus] = useState<PageStatus>(PageStatus.Loading);
  const [message, setMessage] = useState('');

  const handleResendEmail = async () => {
    const email = prompt('メールアドレスを入力してください：');
    if (!email) return;

    try {
      await resendVerificationEmail(email);
      router.push(`
        /auth/email-sent?email=${encodeURIComponent(email)}&emailSent=true
      `);
    } catch (error: any) {
      setMessage(error.message || '確認メールの再送信に失敗しました。少し後で再度お試しください。');
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus(PageStatus.Error);
      setMessage('認証トークンが見つかりません');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus(PageStatus.Success);
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus(PageStatus.Error);
        setMessage(error.response?.data?.error || 'メール認証に失敗しました');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === PageStatus.Loading) {
    return (
      <LoadingScreen message="メールアドレスを認証中..." />
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          {status === PageStatus.Success ? 'メール認証完了' : 'メール認証エラー'}
        </h1>

        <MessageBox
          type={status === PageStatus.Success ? MessageBoxType.Success : MessageBoxType.Error}
          message={message}
        />

        <div className={`flex gap-2 ${status === PageStatus.Error ? 'items-center justify-between' : 'justify-end'}`}>
          {status === PageStatus.Error && (
            <GeneralAsyncButton
              onClick={handleResendEmail}
              isLoading={isSendingEmail}
              loadingText="送信中..."
              mainText="確認メールを再送信"
            />
          )}

          <GeneralButton onClick={() => router.push('/auth/login')}>
            ログインページへ
          </GeneralButton>
        </div>
      </div>
    </div>
  );
}