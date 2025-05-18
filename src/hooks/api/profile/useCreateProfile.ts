import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useCreateProfile() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      message.success('프로필이 등록되었습니다!');
      // window.location.href = '/profile'; // 필요시 이동
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      message.error(error?.response?.data?.message || '프로필 등록 실패');
    },
  });
}
