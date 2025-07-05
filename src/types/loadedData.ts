import { Movie } from "./database/movie";
import { Thread } from "./database/thread";
import { Comment } from "./database/comment";

// クライアントに渡す初期データ構造
export interface LoadedData<T> {
  data: T | null;
  error: string | null;
}

export interface LoadedDataForThreadPage {
  thread: LoadedData<Thread>;
  comments: LoadedData<Comment[]>;
}