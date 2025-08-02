// src/components/TicketList.jsx
import { Link } from 'react-router-dom';
import TicketActions from './TicketActions';

export default function TicketList({ tickets, showActions, currentUser }) {
  if (!tickets || tickets.length === 0) {
    return <div className="empty-tickets">No tickets found</div>;
  }

  return (
    <div className="ticket-list space-y-4">
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card p-4 border rounded-lg shadow-sm">
          <Link to={`/tickets/${ticket.id}`} className="block">
            <h3 className="text-lg font-medium">{ticket.subject}</h3>
            <p className="text-sm text-gray-600">Status: {ticket.status}</p>
            {ticket.assigned_to && (
              <p className="text-sm text-gray-600">
                Assigned to: {ticket.assigned_to.username}
              </p>
            )}
          </Link>
          
          {showActions && (
            <TicketActions 
              ticket={ticket} 
              user={currentUser} 
              className="mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}