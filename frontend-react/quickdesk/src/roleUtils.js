// Centralized role configuration
export const ROLE_CONFIG = {
  admin: {
    dashboard: '/admin/dashboard',
    navItems: [
      { path: '/admin/dashboard', label: 'Admin Dashboard' },
      { path: '/admin/users', label: 'User Management' },
      { path: '/admin/settings', label: 'System Settings' }
    ],
    permissions: ['manage_users', 'manage_tickets', 'system_config']
  },
  support_agent: {
    dashboard: '/agent/queue',
    navItems: [
      { path: '/agent/queue', label: 'Ticket Queue' },
      { path: '/agent/assigned', label: 'My Tickets' }
    ],
    permissions: ['assign_tickets', 'resolve_tickets']
  },
  end_user: {
    dashboard: '/dashboard',
    navItems: [
      { path: '/dashboard', label: 'My Tickets' },
      { path: '/create-ticket', label: 'New Ticket' }
    ],
    permissions: ['create_tickets', 'view_own_tickets']
  }
};

export const hasPermission = (user, permission) => {
  return user && ROLE_CONFIG[user.role]?.permissions.includes(permission);
};