import { Comment } from "./comment";
import { Thread } from "./thread";

export interface User {
  id: number;
  userId: string;
  username: string;
  password: string;
  email: string;
  comments?: Comment[];
  threads?: Thread[];
};