import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className='text-center mt-10'>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return <>{children}</>;
}