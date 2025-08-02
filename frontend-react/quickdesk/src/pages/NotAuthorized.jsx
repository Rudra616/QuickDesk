import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function NotAuthorized() {
  const { user } = useAuth();

  return (
    <div className="not-authorized-container">
      <h2>403 - Access Denied</h2>
      <p>
        You don't have permission to access this page.
        {user ? ` Your role is ${user.role}.` : ' Please login first.'}
      </p>
      
      <div className="action-buttons">
        {user ? (
          <Link to="/dashboard" className="btn-primary">
            Return to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}