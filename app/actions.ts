'use server';

import axios from '@/lib/axios';
import type { User } from '@/lib/types';
import { login } from '@/lib/auth';

export async function getUsers(): Promise<User[]> {
  try {
    const response = await axios.get('/users');

    return response?.data?.data;
  } catch (error) {
    return [];
  }
}

export async function loginUser(formData: FormData): Promise<string> {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    throw new Error('Invalid email or password');
  }

  const response = await axios.post(`/auth/login`, {
    emailOrPhone: email,
    password,
  });

  const { accessToken, user } = response.data?.data;
  await login({ accessToken, user });

  return accessToken;
}

export async function sendText(id: string, formData: FormData) {
  const text = formData.get('text')?.toString();

  if (!text) {
    throw new Error('Invalid message');
  }

  try {
    const response = await axios.post(`/chat/${id}`, {
      text,
    });

    return response?.data?.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function getInitialMessages(id: string): Promise<any> {
  try {
    const response = await axios.get(`/chat/${id}?limit=1500&page=1`);

    return response?.data?.data;
  } catch (error) {
    return [];
  }
}
