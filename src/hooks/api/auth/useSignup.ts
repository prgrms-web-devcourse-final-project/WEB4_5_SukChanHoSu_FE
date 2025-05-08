import { useMutation } from '@tanstack/react-query';
import { SignupRequest, SignupResponse } from '../../../types/auth';
import { signup } from '../../../api/auth';

export function useSignup() {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signup,
  });
}
