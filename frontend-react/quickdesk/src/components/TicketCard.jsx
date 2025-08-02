import { Link } from 'react-router-dom';
import TicketActions from './TicketActions';

export default function TicketCard({ ticket, showAssigned }) {
  return (
    <div className="ticket-card">
      <Link to={`/tickets/${ticket.id}`}>
        <h3>{ticket.subject}</h3>
        <p>Status: {ticket.status.replace('_', ' ')}</p>
        {showAssigned && ticket.assigned_to && (
          <p>Assigned to: {ticket.assigned_to.username}</p>
        )}
      </Link>
      <TicketActions ticket={ticket} />
    </div>
  );
}