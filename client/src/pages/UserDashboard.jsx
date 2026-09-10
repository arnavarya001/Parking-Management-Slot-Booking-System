import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function UserDashboard() {
  const [slots, setSlots] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Booking modal/form state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchSlots();
  }, [locationFilter, typeFilter]);

  const fetchSlots = async () => {
    try {
      let url = `${API_URL}/api/slots?`;
      if (locationFilter) url += `location=${encodeURIComponent(locationFilter)}&`;
      if (typeFilter) url += `type=${encodeURIComponent(typeFilter)}&`;

      const res = await fetch(url);
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const handleOpenBooking = (slot) => {
    setSelectedSlot(slot);
    setBookingMessage('');
    setBookingError('');
    setStartTime('');
    setEndTime('');
  };

  const handleBookSlot = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingError('');

    if (!startTime || !endTime) {
      setBookingError('Please enter both start time and end time');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          slotId: selectedSlot._id,
          startTime,
          endTime
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.message || 'Could not complete booking');
      } else {
        setBookingMessage('Slot booked successfully!');
        setSelectedSlot(null);
        fetchSlots();
      }
    } catch (err) {
      setBookingError('Server connection error. Please try again.');
    }
  };

  return (
    <div>
      <h2>Available Parking Slots</h2>

      {/* Filter Section */}
      <div className="filter-box">
        <h3>Filter Slots</h3>
        <div className="filter-controls">
          <div className="form-group-inline">
            <label>Location: </label>
            <input
              type="text"
              placeholder="e.g. Ground Floor, Basement"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="form-group-inline">
            <label>Type: </label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="EV">EV</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={() => { setLocationFilter(''); setTypeFilter(''); }}>
            Reset Filters
          </button>
        </div>
      </div>

      {bookingMessage && <p className="success-message">{bookingMessage}</p>}
      {bookingError && <p className="error-message">{bookingError}</p>}

      {/* Booking Form Card when a slot is clicked */}
      {selectedSlot && (
        <div className="booking-modal">
          <h3>Book Slot: {selectedSlot.slotNumber} ({selectedSlot.type})</h3>
          <p>Location: {selectedSlot.location} | Zone: {selectedSlot.zone?.name || 'N/A'}</p>
          
          <form onSubmit={handleBookSlot}>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Confirm Booking</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setSelectedSlot(null)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Slots Table */}
      {slots.length === 0 ? (
        <p>No parking slots found matching your criteria.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Slot Number</th>
              <th>Location</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot._id}>
                <td><strong>{slot.slotNumber}</strong></td>
                <td>{slot.location}</td>
                <td>{slot.type}</td>
                <td>{slot.zone?.name || 'Unassigned'}</td>
                <td>
                  <span className={`status-badge ${slot.status}`}>
                    {slot.status}
                  </span>
                </td>
                <td>
                  {slot.status === 'available' ? (
                    <button
                      className="btn-primary"
                      onClick={() => handleOpenBooking(slot)}
                    >
                      Book Slot
                    </button>
                  ) : (
                    <button disabled className="btn-disabled">Blocked</button>
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

export default UserDashboard;
