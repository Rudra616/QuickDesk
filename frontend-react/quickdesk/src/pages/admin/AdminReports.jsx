// src/pages/admin/AdminReports.jsx
import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import API from '../../api/axios';

export default function AdminReports() {
  const { user } = useAuth();
  const [reportData, setReportData] = React.useState(null);

  React.useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await API.get('admin/reports/');
        setReportData(response.data);
      } catch (error) {
        console.error('Failed to load reports:', error);
      }
    };
    
    fetchReportData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Administrative Reports</h1>
      {reportData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Render your report data here */}
        </div>
      ) : (
        <p>Loading reports...</p>
      )}
    </div>
  );
}