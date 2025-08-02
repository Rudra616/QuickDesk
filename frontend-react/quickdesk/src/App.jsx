import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import RoleRoute from './auth/RoleRoute';
import Navbar from './components/Navbar';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotAuthorized from './pages/NotAuthorized';
import NotFound from './pages/NotFound';

// Authenticated pages
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import CategoryList from './pages/CategoryList';

// Admin pages
import AdminCategoryManager from './pages/admin/AdminCategoryManager';
import UserManagement from './pages/admin/UserManagement';
import AdminReports from './pages/admin/AdminReports';

// Agent pages
import AgentTicketQueue from './pages/agent/AgentTicketQueue';
import AssignedTickets from './pages/agent/AssignedTickets';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Authenticated routes for all logged-in users */}
        <Route element={<RoleRoute allowedRoles={['user', 'agent', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/categories" element={<CategoryList />} />
        </Route>

        {/* Agent-specific routes */}
        <Route element={<RoleRoute allowedRoles={['agent', 'admin']} />}>
          <Route path="/agent/queue" element={<AgentTicketQueue />} />
          <Route path="/agent/assigned" element={<AssignedTickets />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin/categories" element={<AdminCategoryManager />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={
          <Navigate to={
            user?.role === 'admin' ? '/admin/dashboard' :
            user?.role === 'agent' ? '/agent/queue' : 
            '/dashboard'
          } replace />
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;