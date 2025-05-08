import { SignupRequest, SignupResponse } from '../types/auth';
import apiClient from './client';

export const signup = async (req: SignupRequest): Promise<SignupResponse> => {
  const res = await apiClient.post<SignupResponse>('/api/auth/join', req);
  return res.data;
};
