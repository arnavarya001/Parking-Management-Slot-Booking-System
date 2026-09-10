import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to fetch bookings');
      } else {
        setBookings(data);
      }
    } catch (err) {
      setError('Server error fetching bookings');
    }
  };

  return (
    <div>
      <h2>All Parking Bookings</h2>
      
      {error && <p className="error-message">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found in the system.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>User Email</th>
              <th>Slot No.</th>
              <th>Location</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><strong>{b.user?.name || 'N/A'}</strong></td>
                <td>{b.user?.email || 'N/A'}</td>
                <td>{b.slot?.slotNumber || 'N/A'}</td>
                <td>{b.slot?.location || 'N/A'}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>{new Date(b.endTime).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${b.status}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllBookings;
