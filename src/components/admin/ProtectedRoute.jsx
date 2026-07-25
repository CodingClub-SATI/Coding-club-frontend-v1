import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // In a real app, this would check a Context/Redux store for a valid JWT token.
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';

  // If not authenticated, redirect to login page. Replace prevents going back to the protected route.
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}