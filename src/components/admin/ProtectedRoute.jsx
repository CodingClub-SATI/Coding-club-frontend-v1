import { Outlet } from 'react-router';

// Auth is enforced by requireAuthLoader (features/auth/api.js) attached to
// this route in router/index.jsx — by the time this component renders, the
// loader has already confirmed the session is valid. This just provides
// the outlet for its child routes.
export default function ProtectedRoute() {
  return <Outlet />;
}
