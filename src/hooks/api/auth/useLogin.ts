import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { message } from 'antd';
import { AxiosError } from 'axios';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  code: string;
  message: string;
  data: {
    grantType: string;
    accessToken: string;
    refreshToken: string;
  };
};

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        message.success('로그인 성공!');
        // window.location.href = '/'; // 필요시 라우팅
      } else {
        message.error(data?.message || '로그인 실패');
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(error?.response?.data?.message || '로그인 실패');
    },
  });
}
