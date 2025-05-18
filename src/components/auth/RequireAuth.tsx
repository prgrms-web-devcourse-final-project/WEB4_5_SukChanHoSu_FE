import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
