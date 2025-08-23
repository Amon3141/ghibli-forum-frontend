'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import InputField from '@/components/ui/InputField';
import { MessageBoxType } from '@/types/types';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { PageStatus } from '@/types/types';

interface VerifyEmailPageClientProps {
  token: string | null;
}

export default function VerifyEmailPageClient({ token }: VerifyEmailPageClientProps) {
  const { resendVerificationEmail, isSendingEmail } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<PageStatus>(PageStatus.Loading);
  const [message, setMessage] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  const handleShowEmailInput = () => {
    setShowEmailInput(true);
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setMessage('メールアドレスを入力してください');
      return;
    }

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
        const response = await api.get(`/auth/verify-email?token=${token}`, {
          timeout: 20000
        });
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
    <div className="h-full w-full max-w-md flex items-center justify-center p-4 mb-5">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-5">
          {status === PageStatus.Success ? 'メール認証完了' : 'メール認証エラー'}
        </h1>

        <MessageBox
          type={status === PageStatus.Success ? MessageBoxType.Success : MessageBoxType.Error}
          message={message}
        />

        {showEmailInput && (
          <div className="space-y-3">
            <InputField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力してください"
              type="email"
            />
          </div>
        )}

        <div className={'flex items-center justify-end gap-2'}>
          {status === PageStatus.Success && (
            <GeneralButton onClick={() => router.push('/auth/login')}>
              ログインページへ
            </GeneralButton>
          )}

          {status === PageStatus.Error && (
            <GeneralAsyncButton
              onClick={showEmailInput ? handleResendEmail : handleShowEmailInput}
              isLoading={isSendingEmail}
              loadingText="送信中..."
              mainText={showEmailInput ? "確認メールを送信" : "確認メールを再送信"}
              color={showEmailInput ? "primary" : "default"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
