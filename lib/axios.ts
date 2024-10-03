import axios from 'axios';
import { getSession } from '@/lib/auth';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async config => {
    const session = await getSession();
    const accessToken = session?.accessToken;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
