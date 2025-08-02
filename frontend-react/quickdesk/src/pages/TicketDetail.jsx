import { useUserRoles } from '../auth/useUserRoles';

export default function TicketDetail() {
  const { isAdmin, isAgent, isEndUser } = useUserRoles();
  // ... existing state and effects

  return (
    <div className="ticket-detail">
      <div className="ticket-header">
        <h2>{ticket.subject}</h2>
        {(isAdmin || isAgent) && (
          <span className="ticket-id">ID: {ticket.id}</span>
        )}
      </div>

      <div className="ticket-meta">
        <p>Status: <span className={`status-${ticket.status}`}>{ticket.status}</span></p>
        {ticket.category && <p>Category: {ticket.category.name}</p>}
        {(isAdmin || isAgent) && ticket.assigned_to && (
          <p>Assigned to: {ticket.assigned_to.username}</p>
        )}
      </div>

      {isAdmin && (
        <div className="admin-badge">
          <span>Admin View</span>
        </div>
      )}

      <div className="ticket-description">
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </div>

      {/* Different action buttons based on role */}
      <div className="ticket-actions">
        {isEndUser && ticket.status === 'open' && (
          <button onClick={() => handleStatusChange('closed')}>
            Close Ticket
          </button>
        )}

        {(isAgent || isAdmin) && (
          <TicketStatusDropdown 
            currentStatus={ticket.status} 
            onChange={handleStatusChange}
          />
        )}
      </div>

      <TicketComments ticketId={id} />
    </div>
  );
}