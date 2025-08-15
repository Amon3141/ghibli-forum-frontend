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

export interface Thread {
  id: number;
  title: string;
  createdAt: string;
  updatedAt?: string;
  description: string;
  movieId: number;
  movie?: Movie;
  creatorId: number;
  creator?: User;
  comments?: Comment[];
  reactions?: Reaction[];
  _count?: {
    comments: number;
  };
};

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