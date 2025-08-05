import { Comment } from "./comment";
import { Thread } from "../thread";
import { Movie } from "./movie";

export interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  imagePath?: string;
  bio?: string;
  favoriteCharacter?: string;
  favoriteMovieId?: number;
  favoriteMovie?: Movie;
  comments?: Comment[];
  threads?: Thread[];
};