import { Comment } from "./comment";
import { Thread } from "./thread";

export interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  imagePath?: string;
  comments?: Comment[];
  threads?: Thread[];
};