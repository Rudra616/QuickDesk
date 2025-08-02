import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import API from '../api/axios';
import TicketCard from '../components/TicketCard';
import { Container, Row, Col, ButtonGroup, Button, Alert, Card } from 'react-bootstrap';

export default function Dashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let endpoint = 'tickets/';
        if (user?.role === 'user') endpoint = 'tickets/my-tickets/';
        
        const response = await API.get(endpoint, {
          params: filter !== 'all' ? { status: filter } : {}
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Ticket fetch error:', error);
      }
    };

    fetchTickets();
  }, [user, filter]);

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-4">Welcome, {user?.username}</h1>
          <p className="text-muted">Role: {user?.role.replace('_', ' ')}</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <ButtonGroup>
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
            >
              All Tickets
            </Button>
            <Button 
              variant={filter === 'open' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('open')}
            >
              Open
            </Button>
            
            {(user?.role === 'agent' || user?.role === 'admin') && (
              <>
                <Button 
                  variant={filter === 'in_progress' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('in_progress')}
                >
                  In Progress
                </Button>
                <Button 
                  variant={filter === 'resolved' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('resolved')}
                >
                  Resolved
                </Button>
              </>
            )}
          </ButtonGroup>
        </Col>
      </Row>

      {/* Tickets Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <Col key={ticket.id}>
              <TicketCard 
                ticket={ticket} 
                showActions={true}
              />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No tickets found</Alert>
          </Col>
        )}
      </Row>

      {/* Admin Stats */}
      {user?.role === 'admin' && (
        <Row className="mt-4">
          <Col>
            <Card bg="light" className="p-3">
              <h3>Admin Dashboard</h3>
              <p>Total Tickets: {tickets.length}</p>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}