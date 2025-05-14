'use client'

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';

import ThreadCard from "@/components/features/ThreadCard";
import InputField from "@/components/ui/InputField";
import GeneralButton from "@/components/ui/GeneralButton";

import { Movie } from '@/types/movie';
import { Thread } from '@/types/thread';

interface MoviePageProps {
  params: Promise<{
    movieId: number;
  }>
}

interface ThreadFormData {
  title: string;
  description: string
};

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const { movieId } = use(params);

  const [threads, setThreads] = useState<Thread[]>([]);

  const [showThreadForm, setShowThreadForm] = useState(false);
  const [newThread, setNewThread] = useState<ThreadFormData>({
    title: '',
    description: ''
  });
  const [createThreadError, setCreateThreadError] = useState<string | null>(null);
  const [createThreadMessage, setCreateThreadMessage] = useState<string | null>(null);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      setMovie(response.data);
      setThreads(response.data.threads);
    } catch (err: any) {
      console.error('映画取得時にエラーが発生しました', err);
    }
  }

  const resetThreadForm = () => {
    setNewThread({
      title: '',
      description: ''
    });
    setCreateThreadError(null);
    setShowThreadForm(false);
  }

  const handleCreateThread = async () => {
    try {
      const response = await api.post(`/movies/${movieId}/threads`, newThread);
      setThreads([response.data, ...threads]);
      setCreateThreadMessage('スレッドが作成されました');
      resetThreadForm();
    } catch (err: any) {
      console.error('スレッド作成時にエラーが発生しました', err);
      setCreateThreadError(err.response?.data?.error || 'スレッドの作成に失敗しました');
    }
  }

  useEffect(() => {
    fetchMovie();
  }, []);
  
  return (
    <div className="min-h-full w-full flex items-center justify-center">
      {/* Background Image */}
      {movie && movie.imagePath && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={movie.imagePath}
            alt={`${movie?.title} background`}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className={`
        w-full h-full bg-white/75 rounded-xl py-4 px-6
        border-4 border-white/90
      `}>
        <div className="space-y-5 w-full">
          {movie && (
            <div className="mb-4 border-b-1 border-gray-200 pb-3">
              <h2 className="text-center">{movie.title}のスレッド</h2>
            </div>
          )}
          <div className="space-y-3">
            {createThreadMessage && (
              <div className="rounded-sm bg-green-100 p-4">
                <p className="text-textcolor/80">{createThreadMessage}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-6">
              <h3 className="text-2xl font-bold py-1">スレッド一覧</h3>
              {!showThreadForm && (
                <GeneralButton onClick={() => {
                  setShowThreadForm(true);
                  setCreateThreadMessage(null);
                }}>+ スレッドを追加</GeneralButton>
              )}
            </div>
            {showThreadForm && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateThread();
              }} className="
                bg-gray-50 rounded-md border-1 border-gray-200 w-2/3 p-5 space-y-3
              ">
                <h3 className="text-xl font-bold text-textcolor/90">新しいスレッドを作成</h3>
                <div className="flex flex-col items-start space-y-3 mb-4">
                  <InputField
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="タイトル"
                  />
                  <InputField
                    value={newThread.description}
                    onChange={(e) => setNewThread({ ...newThread, description: e.target.value })}
                    placeholder="概要"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <GeneralButton type="button" onClick={resetThreadForm}>キャンセル</GeneralButton>
                  <GeneralButton type="submit">作成</GeneralButton>
                </div>
                {createThreadError && (
                  <div className="rounded-sm bg-red-100 p-4">
                    <p className="text-textcolor/80">{createThreadError}</p>
                  </div>
                )}
              </form>
            )}
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                movieId={movieId}
                threadId={thread.id}
                title={thread.title}
                author={thread.creator?.username || '不明'}
                summary={thread.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}