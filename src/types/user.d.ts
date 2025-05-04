import { Comment } from "./comment";
import { Thread } from "./thread";

export interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  comments?: Comment[];
  threads?: Thread[];
};