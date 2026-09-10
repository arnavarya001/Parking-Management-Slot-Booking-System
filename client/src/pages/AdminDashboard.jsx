import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error fetching dashboard stats');
      } else {
        setStats(data);
      }
    } catch (err) {
      setError('Could not connect to server');
    }
  };

  return (
    <div>
      <h2>Admin Overview Dashboard</h2>
      
      {error && <p className="error-message">{error}</p>}

      {stats ? (
        <>
          {/* Summary Cards */}
          <div className="card-container">
            <div className="card stat-card">
              <h3>Available Slots</h3>
              <p className="stat-number green">{stats.availableSlots}</p>
            </div>
            <div className="card stat-card">
              <h3>Occupied Slots</h3>
              <p className="stat-number orange">{stats.occupiedSlots}</p>
            </div>
            <div className="card stat-card">
              <h3>Today's Bookings</h3>
              <p className="stat-number blue">{stats.todaysBookings}</p>
            </div>
          </div>

          {/* Zone-wise Occupancy Table */}
          <h3>Zone-wise Occupancy</h3>
          {stats.zoneStats && stats.zoneStats.length === 0 ? (
            <p>No zones defined yet. Add zones in "Manage Zones".</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Total Slots</th>
                  <th>Occupied Slots</th>
                  <th>Available Slots</th>
                </tr>
              </thead>
              <tbody>
                {stats.zoneStats.map((zone, idx) => (
                  <tr key={idx}>
                    <td><strong>{zone.zoneName}</strong></td>
                    <td>{zone.total}</td>
                    <td>{zone.occupied}</td>
                    <td>{zone.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
}

export default AdminDashboard;
