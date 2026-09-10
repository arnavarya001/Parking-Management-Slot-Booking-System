import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/bookings/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error cancelling booking');
      } else {
        setMessage('Booking cancelled successfully');
        fetchMyBookings();
      }
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  return (
    <div>
      <h2>My Booking History</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {bookings.length === 0 ? (
        <p>You have not made any bookings yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Location</th>
              <th>Type</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><strong>{b.slot?.slotNumber || 'N/A'}</strong></td>
                <td>{b.slot?.location || 'N/A'}</td>
                <td>{b.slot?.type || 'N/A'}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>{new Date(b.endTime).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${b.status}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === 'active' ? (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyBookings;
