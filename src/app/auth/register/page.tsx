'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import { IoEye, IoEyeOff } from "react-icons/io5";

import InputField from '@/components/ui/InputField';
import GeneralAsyncButton from '@/components/ui/GeneralAsyncButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';

export default function RegisterForm() {
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");

  const router = useRouter();
  const { register, isLoading } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegisterError("パスワードが一致しません");
      return;
    }
    try {
      await register(userId, username, password, email);
      router.push('/auth/login')
    } catch (err: any) {
      setRegisterError(err.response?.data?.error);
    }
  };

  const handleGoToLogin = () => {
    router.push('/auth/login');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full max-w-sm mx-auto gap-4 mb-5 p-2">
      <h2 className="text-xl sm:text-2xl font-bold">新規登録</h2>
      <form onSubmit={handleRegister} className="space-y-2 w-full">
        <InputField
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          placeholder="ユーザー名"
        />
        <InputField
          value={userId}
          onChange={(e)=>setUserId(e.target.value)}
          placeholder="ユーザーID"
        />
        <InputField
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="メールアドレス"
        />
        <div className="relative w-full">
          <InputField
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="パスワード"
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
            onChange={(e)=>setConfirmPassword(e.target.value)}
            placeholder="パスワード（確認用）)"
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
        
        <div className="flex justify-between items-center mt-2.5">
          <button
            type="button"
            onClick={handleGoToLogin}
            className="small-text text-indigo-500 underline hover:text-indigo-700"
          >
            すでにアカウントをお持ちですか？
          </button>
          <GeneralAsyncButton
            type="submit"
            mainText="登録"
            loadingText="登録中..."
            isLoading={isLoading}
          />
        </div>
      </form>
      {registerError && <MessageBox type={MessageBoxType.Error} message={registerError} />}
    </div>
  );
}