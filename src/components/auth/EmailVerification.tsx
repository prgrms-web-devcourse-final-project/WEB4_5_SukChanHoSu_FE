import { useState, useEffect } from 'react';
import { Button, Input, Space, Form } from 'antd';
import { useEmailVerification } from '../../hooks/api/auth/useEmailVerification';

interface Props {
  email: string;
  onVerified: () => void;
  disabled?: boolean;
}

export default function EmailVerification({
  email,
  onVerified,
  disabled,
}: Props) {
  const [code, setCode] = useState('');
  const { sending, verifying, verified, timer, sendCode, verifyCode } =
    useEmailVerification();

  useEffect(() => {
    if (verified) onVerified();
  }, [verified, onVerified]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button
          onClick={() => sendCode(email)}
          loading={sending}
          disabled={disabled || !email || timer > 0}
        >
          {timer > 0 ? `재전송 (${timer}s)` : '인증코드 받기'}
        </Button>
      </Space>
      <Form.Item label="인증코드" required style={{ marginBottom: 0 }}>
        <Space>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증코드 입력"
            style={{ width: 160 }}
            maxLength={8}
            disabled={verifying}
          />
          <Button
            type="primary"
            onClick={() => verifyCode(email, code)}
            loading={verifying}
            disabled={!code || verified}
          >
            인증하기
          </Button>
        </Space>
      </Form.Item>
      {verified && (
        <div style={{ color: '#52c41a', fontWeight: 500 }}>
          이메일 인증 완료
        </div>
      )}
    </Space>
  );
}
