import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function ProtectedAdmin({ children }) {
  const { authenticated, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) return <div className="screen-loader">Checking admin session...</div>;
  if (!authenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }}/>;
  return children;
}
