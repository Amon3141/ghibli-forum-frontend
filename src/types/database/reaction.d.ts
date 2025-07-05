export interface Reaction {
  id: number;
  type: string;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  user?: User;
  commentId?: number;
  comment?: Comment;
  threadId?: number;
}