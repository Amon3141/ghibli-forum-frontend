import { Thread } from "./database";
import { Comment } from "./database";

// SSRでクライアントに渡す初期データ構造
export interface LoadedData<T> {
  data: T | null;
  error: string | null;
}

export interface LoadedDataForThreadPage {
  thread: LoadedData<Thread>;
  comments: LoadedData<Comment[]>;
}