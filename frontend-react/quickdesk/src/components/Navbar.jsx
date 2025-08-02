import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Helper function to display role names
  const getDisplayRole = (role) => {
    const roleMap = {
      'user': 'User',
      'agent': 'Agent',
      'admin': 'Admin'
    };
    return roleMap[role] || role;
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand/Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4">
          QuickDesk
        </BootstrapNavbar.Brand>

        {/* Toggle Button for Mobile */}
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {/* Common links for all logged-in users */}
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/tickets/create">New Ticket</Nav.Link>

                {/* Agent-specific links */}
                {(user.role === 'agent' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/agent/queue">Ticket Queue</Nav.Link>
                )}

                {/* Admin-specific links */}
                {user.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin/categories">Categories</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                  </>
                )}

                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="primary" id="dropdown-user">
                    {user.username} ({getDisplayRole(user.role)})
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={logout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Guest links */}
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}