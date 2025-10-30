import { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId;
  title: string;
  content: string;
  authorId: string;
  username: string;
  createdAt: Date;
  replies: Reply[];
}

export interface Reply {
  _id?: ObjectId;
  content: string;
  authorId: string;
  username: string;
  createdAt: Date;
}