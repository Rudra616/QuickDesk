// src/pages/agent/AgentTicketQueue.jsx
import { useAuth } from '../../auth/AuthContext';
import API from '../../api/axios';
import { useEffect, useState } from 'react';
import TicketList from '../../components/TicketList';

export default function AgentTicketQueue() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get('tickets/queue/');
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching ticket queue:', err);
      }
    };
    
    fetchTickets();
  }, []);

  return (
    <div className="agent-queue">
      <h2>Ticket Queue</h2>
      <TicketList 
        tickets={tickets} 
        showActions={true}
        currentUser={user}
      />
    </div>
  );
}