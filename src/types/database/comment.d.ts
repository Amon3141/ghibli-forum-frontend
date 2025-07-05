import { Thread } from "../thread";
import { User } from "../user";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  threadId: number;
  thread?: Thread;
  authorId: number;
  author?: User;
  parentId?: number;
  parent?: Comment;
  replyToId?: number;
  replyTo?: Comment;
  mentionedBy?: Comment[];
  reactions?: Reaction[];
  _count?: {
    replies: number;
  };
}