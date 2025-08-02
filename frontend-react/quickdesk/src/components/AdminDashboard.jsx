import { useEffect, useState } from 'react';
import API from '../api/axios';
import AdminStatsCard from '../components/AdminStatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    openTickets: 0,
    resolvedTickets: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ticketsRes] = await Promise.all([
          API.get('admin/users/stats/'),
          API.get('admin/tickets/stats/')
        ]);
        
        setStats({
          users: usersRes.data.count,
          openTickets: ticketsRes.data.open,
          resolvedTickets: ticketsRes.data.resolved
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Administrator Dashboard</h2>
      <div className="stats-grid">
        <AdminStatsCard 
          title="Total Users" 
          value={stats.users} 
          icon="👥"
        />
        <AdminStatsCard 
          title="Open Tickets" 
          value={stats.openTickets} 
          icon="⚠️"
        />
        <AdminStatsCard 
          title="Resolved Tickets" 
          value={stats.resolvedTickets} 
          icon="✅"
        />
      </div>

      <div className="admin-actions">
        <button className="danger-button">
          Purge Old Tickets
        </button>
        <button>
          Generate Reports
        </button>
      </div>
    </div>
  );
}