import { CoreMessage } from 'ai';

export type Message = {
  id: string;
  text: string;
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export interface User extends Record<string, any> {
  id: string;
  name: string;
  profile_picture: string;
  bio: string;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}

export interface User extends Record<string, any> {
  id: string;
  email: string;
  password: string;
  salt: string;
}

export interface SessionPayload {
  user: any;
  accessToken: string;
  expires: Date;
}