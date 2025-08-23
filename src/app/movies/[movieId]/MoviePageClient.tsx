'use client';
import { useState, useEffect } from 'react';

import ThreadCard from "@/components/features/thread/ThreadCard";
import GeneralButton from "@/components/ui/GeneralButton";
import ThreadCreateForm from "@/components/features/thread/ThreadCreateForm";
import LoadingScreen from '@/components/ui/LoadingScreen';

import { Movie } from '@/types/database';
import { Thread } from '@/types/database';
import { LoadedData } from '@/types/ssr';
import { ThreadSortType, SortDirection } from '@/types/sort';

import { getSortedThreads } from '@/utils/sortHelpers';
import ThreadSortButton from '@/components/features/thread/ThreadSortButton';

interface MoviePageProps {
  movieId: number;
  loadedMovie: LoadedData<Movie>;
}

export default function MoviePageClient({
  movieId, loadedMovie
}: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  
  const [isFetchingMovie, setIsFetchingMovie] = useState(true);
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [createThreadMessage, setCreateThreadMessage] = useState<string | null>(null);

  const [sortType, setSortType] = useState<ThreadSortType>(ThreadSortType.comments);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.desc);

  const initializeData = async () => {
    if (loadedMovie.data) {
      setMovie(loadedMovie.data);
      const sortedThreads = getSortedThreads(loadedMovie.data.threads ?? [], sortType, sortDirection);
      setThreads(sortedThreads);
    } else if (loadedMovie.error) {
      // TODO: エラーメッセージを表示
    }
    setIsFetchingMovie(false);
  }

  const handleSortThreads = (newSortType: ThreadSortType) => {
    let newSortDirection: SortDirection;
    if (newSortType === sortType) {
      newSortDirection = sortDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
    } else {
      newSortDirection = SortDirection.desc;
    }

    setSortType(newSortType);
    setSortDirection(newSortDirection);

    const sortedThreads = getSortedThreads(threads, newSortType, newSortDirection);
    setThreads(sortedThreads);
  }

  const handleCreateThread = (newThread: Thread) => {
    setThreads(getSortedThreads([newThread, ...threads], sortType, sortDirection));
    setCreateThreadMessage('スレッドが作成されました');
  }

  useEffect(() => {
    initializeData();
  }, []);

  if (isFetchingMovie) {
    return <LoadingScreen message="映画のスレッドを読み込んでいます..." />;
  }
  
  return (
    <div className="min-h-full w-full max-w-[1000px] mt-0 sm:mt-1.5">
      <div className="space-y-4 sm:space-y-3 px-2 my-1">
        {createThreadMessage && (
          <div className="rounded-sm bg-green-100 p-4">
            <p className="text-textcolor/80">{createThreadMessage}</p>
          </div>
        )}
        <div className="space-y-3 sm:space-y-2">
          <div className="flex flex-col gap-1">
            <div className="w-full flex flex-col items-start gap-1.5 sm:flex-row sm:justify-between sm:items-center pb-2">
              <h3 className="text-lg sm:text-xl font-bold mb-1">{movie && movie.title && `${movie.title}の`}スレッド</h3>
              {!showThreadForm && (
                <GeneralButton
                  onClick={() => {
                    setShowThreadForm(true);
                    setCreateThreadMessage(null);
                  }}
                  color="primary"
                >
                  <span>  + スレッドを作成</span>
                </GeneralButton>
              )}
            </div>
            {showThreadForm && (
              <div className="mb-2">
                <ThreadCreateForm
                  movieId={movieId}
                  setShowThreadForm={setShowThreadForm}
                  onCreateThread={handleCreateThread}
                />
              </div>
            )}
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center gap-4 small-text text-gray-600 border-b border-gray-200 pb-2">
            <ThreadSortButton
              label="投稿日"
              sortType={ThreadSortType.date}
              sortDirection={sortDirection}
              globalSortType={sortType}
              handleSortThreads={handleSortThreads}
            />
            <ThreadSortButton
              label="コメント数"
              sortType={ThreadSortType.comments}
              sortDirection={sortDirection}
              globalSortType={sortType}
              handleSortThreads={handleSortThreads}
            />
            <ThreadSortButton
              label="いいね数"
              sortType={ThreadSortType.likes}
              sortDirection={sortDirection}
              globalSortType={sortType}
              handleSortThreads={handleSortThreads}
            />
          </div>
        </div>

        {/* Threads */}
        <div className="space-y-3">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                movieId={movieId}
                thread={thread}
              />
            ))
          ) : (
            <p className="text-center small-text text-gray-500 py-3">まだスレッドがありません</p>
          )}
        </div>
      </div>
    </div>
  )
}