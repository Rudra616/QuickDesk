import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// auth/RoleRoute.jsx
export default function RoleRoute({ allowedRoles }) {
  // Convert role if needed (backward compatibility)
  const getUserRole = (user) => {
    if (!user) return null;
    // Handle legacy roles if necessary
    if (user.role ===  'user') return 'user';
    if (user.role === 'agent') return 'agent';
    return user.role;
  };

  const { user } = useAuth();
  const userRole = getUserRole(user);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/not-authorized" replace />;
  
  return <Outlet />;
}