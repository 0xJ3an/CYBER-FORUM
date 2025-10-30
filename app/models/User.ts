import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  userId: string;
  username: string;
  createdAt: Date;
  lastLogin: Date;
}

export function generateUserId(): string {
  const digits = '0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += digits[Math.floor(Math.random() * digits.length)];
  }
  return id;
}
