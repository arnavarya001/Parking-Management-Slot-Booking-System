import { useState, useEffect } from 'react';

function Dashboard({ user }) {
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminStats();
    } else {
      fetchSlots();
    }
  }, [user]);

  const fetchSlots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/slots');
      const data = await response.json();
      setSlots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (user.role === 'admin') {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        {stats ? (
          <>
            <div className="card-container">
              <div className="card">
                <h3>Available Slots</h3>
                <p>{stats.availableSlots}</p>
              </div>
              <div className="card">
                <h3>Occupied Slots</h3>
                <p>{stats.occupiedSlots}</p>
              </div>
              <div className="card">
                <h3>Today's Bookings</h3>
                <p>{stats.todaysBookings}</p>
              </div>
            </div>

            <h3>Zone-wise Occupancy</h3>
            <table>
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Total</th>
                  <th>Occupied</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {stats.zoneStats.map((z, i) => (
                  <tr key={i}>
                    <td>{z.zoneName}</td>
                    <td>{z.total}</td>
                    <td>{z.occupied}</td>
                    <td>{z.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </div>
    );
  }

  // User Dashboard View
  return (
    <div>
      <h2>Available Parking Slots</h2>
      <table>
        <thead>
          <tr>
            <th>Slot Number</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot._id}>
              <td>{slot.slotNumber}</td>
              <td>{slot.location}</td>
              <td>{slot.type}</td>
              <td>{slot.status}</td>
              <td>
                {slot.status === 'available' ? (
                  <button className="btn-primary" onClick={() => alert('Booking logic would go here. Check requirements!')}>Book</button>
                ) : (
                  <span>Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
