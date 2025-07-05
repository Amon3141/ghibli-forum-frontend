import ThreadPageClient from "./ThreadPageClient";
import { api } from "@/utils/api";
import { Thread } from "@/types/database/thread";
import { Comment } from "@/types/comment";
import { LoadedData, LoadedDataForThreadPage } from "@/types/loadedData";

interface ThreadPageProps {
  params: Promise<{
    movieId: number;
    threadId: number;
  }>
}

const fetchThread = async (threadId: number): Promise<LoadedData<Thread>> => {
  try {
    const response = await api.get(`/threads/${threadId}`);
    return { data: response.data, error: null };
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || 'スレッド取得時にエラーが発生しました';
    console.error(errorMessage, err);
    return { data: null, error: errorMessage };
  }
}

const fetchAllCommentsForThread = async (threadId: number): Promise<LoadedData<Comment[]>> => {
  try {
    const response = await api.get(`/threads/${threadId}/comments`);
    return { data: response.data, error: null };
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || 'コメント取得時にエラーが発生しました';
    console.error(errorMessage, err);
    return { data: null, error: errorMessage };
  }
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;

  const fetchedData = await Promise.all([
    fetchThread(threadId),
    fetchAllCommentsForThread(threadId)
  ]);

  const initialData: LoadedDataForThreadPage = {
    thread: fetchedData[0],
    comments: fetchedData[1]
  }
  
  return (
    <ThreadPageClient
      threadId={threadId}
      initialData={initialData}
    />
  )
}