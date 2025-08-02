// Custom hook for role-based utilities
import { useAuth } from './AuthContext';

export const useUserRoles = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const isEndUser = user?.role ===  'user';
  
  const hasRole = (roles) => user && roles.includes(user.role);
  
  return { isAdmin, isAgent, isEndUser, hasRole };
};
