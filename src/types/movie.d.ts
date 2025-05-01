import { Thread } from "./thread";

export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
  threads?: Thread[];
};