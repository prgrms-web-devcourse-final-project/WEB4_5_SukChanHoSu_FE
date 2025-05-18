import { SignupRequest, SignupResponse } from '../types/auth';
import apiClient from './client';

export const signup = async (req: SignupRequest): Promise<SignupResponse> => {
  console.log('signup', req);
  const res = await apiClient.post<SignupResponse>('/api/auth/join', req);
  return res.data;
};
