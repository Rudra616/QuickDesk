// src/components/TicketActions.jsx
import API from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function TicketActions({ ticket, user, className }) {
  const handleStatusChange = async (newStatus) => {
    try {
      await API.patch(`tickets/${ticket.id}/`, { status: newStatus });
      // You might want to add a callback to refresh the ticket list
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className={`ticket-actions flex gap-2 ${className}`}>
      {user?.role === 'agent' && (
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      )}
    </div>
  );
}