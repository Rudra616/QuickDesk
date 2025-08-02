// src/pages/agent/AssignedTickets.jsx
import { useAuth } from '../../auth/AuthContext';
import API from '../../api/axios';
import { useEffect, useState } from 'react';
import TicketList from '../../components/TicketList';

export default function AssignedTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get(`tickets/assigned/${user.id}/`);
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching assigned tickets:', err);
      }
    };
    
    if (user) fetchTickets();
  }, [user]);

  return (
    <div className="assigned-tickets">
      <h2>My Assigned Tickets</h2>
      <TicketList 
        tickets={tickets}
        showActions={true}
        currentUser={user}
      />
    </div>
  );
}