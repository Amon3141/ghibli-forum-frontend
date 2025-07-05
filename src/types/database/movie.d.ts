import { Thread } from "./thread";

export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
  imagePath?: string;
  threads?: Thread[];
  _count?: {
    threads: number;
  }
};