'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import { IoEye, IoEyeOff } from "react-icons/io5";

import InputField from '@/components/ui/InputField';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [needsEmailVerification, setNeedsEmailVerification] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [resendMessage, setResendMessage] = useState<string>("");

  const router = useRouter();
  const { user, login, isLoading, isSendingEmail, resendVerificationEmail } = useAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setNeedsEmailVerification(false);
    
    try {
      await login(identifier, password);
    } catch (err: any) {
      const errorData = err.response?.data;
      setLoginError(errorData?.error);
      
      // メール認証が必要な場合
      if (errorData?.emailVerificationRequired) {
        setNeedsEmailVerification(true);
        setUserEmail(errorData?.email || '');
      }
    }
  };

  const handleResendEmail = async () => {
    setResendMessage('');
    try {
      await resendVerificationEmail(userEmail);
      setResendMessage('確認メールを送信しました');
    } catch (error: any) {
      setResendMessage(error.message || '確認メールの再送信に失敗しました。少し後で再度お試しください。');
    }
  };

  const handleGoToRegister = () => {
    router.push('/auth/register');
  }

  if (user) {
    if (user.isFirstTimeLogin) {
      router.replace('/auth/setup-profile');
    } else {
      router.replace('/');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full max-w-sm mx-auto gap-4 mb-5 px-2">
      <h2 className="text-xl sm:text-2xl font-bold">ログイン</h2>
      <form onSubmit={handleLogin} className="space-y-2 w-full">
        <InputField
          value={identifier}
          onChange={(e)=>setIdentifier(e.target.value)}
          placeholder="ユーザーIDまたはメールアドレス"
        />
        <div className="relative w-full">
          <span
            className="absolute inset-y-0 right-2 flex items-center px-1 cursor-pointer text-textcolor/80"
            onClick={togglePasswordVisibility}
            role="button"
            aria-label={isPasswordVisible ? "パスワードを非表示" : "パスワードを表示"}
          >
            {isPasswordVisible ? <IoEye /> : <IoEyeOff />}
          </span>
          <InputField
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="パスワード"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              onClick={handleGoToRegister}
              className="small-text text-amber-600 underline hover:text-amber-700"
            >
              アカウント作成
            </button>
            <GeneralAsyncButton
              type="submit"
              mainText="ログイン"
              loadingText="ログイン中..."
              isLoading={isLoading}
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push('/auth/forgot-password')}
              className="small-text text-gray-500 underline hover:text-gray-700"
            >
              パスワードを忘れた場合
            </button>
          </div>
        </div>
      </form>
      {loginError && (
        <MessageBox type={MessageBoxType.Error} message={loginError} />
      )}
      
      {needsEmailVerification && (
        <div className="w-full space-y-3">
          {resendMessage && (
            <MessageBox
              type={resendMessage.includes('送信しました') ? MessageBoxType.Success : MessageBoxType.Error}
              message={resendMessage}
            />
          )}

          <GeneralAsyncButton
            onClick={handleResendEmail}
            mainText="確認メールを再送信"
            isLoading={isSendingEmail}
            loadingText="送信中..."
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}