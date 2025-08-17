export interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  imagePath?: string;
  isDeleted: boolean;
  deletedAt?: Date;

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
    threads?: number;
  }
};

export interface Thread {
  id: number;
  title: string;
  createdAt: string;
  updatedAt?: string;
  description: string;
  imagePath?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  movieId: number;
  movie?: Movie;
  creatorId: number;
  creator?: User;
  comments?: Comment[];
  reactions?: Reaction[];
  _count?: {
    comments?: number;
    reactions?: number;
  };
};

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  level: number;

  threadId: number | null;
  thread?: Thread;
  authorId: number;
  author?: User;
  parentId: number | null;
  parent?: Comment;
  replyToId: number | null;
  replyTo?: Comment;

  replies?: Comment[];
  mentionedBy?: Comment[];
  reactions?: Reaction[];

  _count?: {
    replies?: number;
  };
}

export enum ReactionType {
  Like = "LIKE",
  Love = "LOVE",
  Laugh = "LAUGH",
  Angry = "ANGRY",
  Sad = "SAD"
}

export enum ReactableType {
  Comment = "comment",
  Thread = "thread",
}

export interface Reaction {
  id: number;
  type: ReactionType;
  reactableType: ReactableType;
  createdAt: string;

  userId: number;
  user?: User;
  commentId?: number;
  comment?: Comment;
  threadId?: number;
  thread?: Thread;
}