import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';

interface Props {
  children: ReactNode;
}

export default function RequireProfile({ children }: Props) {
  const location = useLocation();
  const { isLoading, isError } = useQuery({
    queryKey: ['profileCheck'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/profile/me');
      return data;
    },
    retry: false,
  });

  if (isLoading)
    return (
      <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
    );

  if (isError) {
    return <Navigate to="/profile/edit" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
