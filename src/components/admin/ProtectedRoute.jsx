import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}