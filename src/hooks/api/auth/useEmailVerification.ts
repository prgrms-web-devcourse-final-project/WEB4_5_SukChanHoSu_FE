import { useState, useCallback } from 'react';
import { message } from 'antd';
import { AxiosError } from 'axios';
import apiClient from '../../../api/client';

export function useEmailVerification() {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  // 타이머 관리
  const startTimer = useCallback(() => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 인증코드 전송
  const sendCode = useCallback(
    async (email: string) => {
      setSending(true);
      try {
        await apiClient.post(`/api/email/send?email=${email}`);
        setSent(true);
        setVerified(false);
        message.success('인증코드가 전송되었습니다.');
        startTimer();
      } catch (e) {
        const err = e as AxiosError<{ message?: string }>;
        message.error(err.response?.data?.message || '인증코드 전송 실패');
      } finally {
        setSending(false);
      }
    },
    [startTimer]
  );

  // 인증코드 검증
  const verifyCode = useCallback(async (email: string, code: string) => {
    setVerifying(true);
    try {
      await apiClient.post('/api/email/verify', {
        mail: email,
        verifyCode: code,
      });
      setVerified(true);
      message.success('이메일 인증이 완료되었습니다.');
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      setVerified(false);
      message.error(
        err.response?.data?.message || '인증코드가 올바르지 않습니다.'
      );
    } finally {
      setVerifying(false);
    }
  }, []);

  return {
    sending,
    verifying,
    sent,
    verified,
    timer,
    sendCode,
    verifyCode,
    setSent,
    setVerified,
  };
}
