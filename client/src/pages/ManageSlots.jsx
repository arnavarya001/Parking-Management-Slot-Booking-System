import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [zones, setZones] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Car');
  const [zoneId, setZoneId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSlots();
    fetchZones();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await fetch(`${API_URL}/api/slots`);
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      setError('Error fetching slots');
    }
  };

  const fetchZones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/zones`);
      const data = await res.json();
      setZones(data);
      if (data.length > 0 && !zoneId) {
        setZoneId(data[0]._id);
      }
    } catch (err) {
      setError('Error fetching zones');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!slotNumber || !location || !type || !zoneId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/slots/${editingId}`
        : `${API_URL}/api/slots`;

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          slotNumber,
          location,
          type,
          zone: zoneId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error saving slot');
      } else {
        setMessage(editingId ? 'Slot updated successfully' : 'Slot created successfully');
        resetForm();
        fetchSlots();
      }
    } catch (err) {
      setError('Server error while saving slot');
    }
  };

  const handleEdit = (slot) => {
    setEditingId(slot._id);
    setSlotNumber(slot.slotNumber);
    setLocation(slot.location);
    setType(slot.type);
    setZoneId(slot.zone?._id || slot.zone || '');
    setMessage('');
    setError('');
  };

  const resetForm = () => {
    setEditingId(null);
    setSlotNumber('');
    setLocation('');
    setType('Car');
    if (zones.length > 0) setZoneId(zones[0]._id);
  };

  const handleToggleStatus = async (slot) => {
    const nextStatus = slot.status === 'available' ? 'blocked' : 'available';
    try {
      const res = await fetch(`${API_URL}/api/slots/${slot._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setMessage(`Slot ${slot.slotNumber} marked as ${nextStatus}`);
        fetchSlots();
      }
    } catch (err) {
      setError('Error changing slot status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parking slot?')) return;
    try {
      const res = await fetch(`${API_URL}/api/slots/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Slot deleted successfully');
        fetchSlots();
      }
    } catch (err) {
      setError('Error deleting slot');
    }
  };

  return (
    <div>
      <h2>Manage Parking Slots</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Add / Edit Slot Form */}
      <div className="admin-form-box">
        <h3>{editingId ? 'Edit Parking Slot' : 'Add New Parking Slot'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Slot Number</label>
            <input
              type="text"
              placeholder="e.g. A-101"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Ground Floor, East Wing"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="EV">EV</option>
            </select>
          </div>

          <div className="form-group">
            <label>Zone</label>
            <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} required>
              <option value="">Select a Zone</option>
              {zones.map((z) => (
                <option key={z._id} value={z._id}>{z.name} ({z.location})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Slot' : 'Create Slot'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm} style={{ marginLeft: '10px' }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Slots Table */}
      <h3>All Slots</h3>
      {slots.length === 0 ? (
        <p>No parking slots exist. Create one above.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Slot No.</th>
              <th>Location</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <button
                    className={slot.status === 'available' ? 'btn-warning' : 'btn-primary'}
                    onClick={() => handleToggleStatus(slot)}
                    style={{ marginRight: '5px' }}
                  >
                    {slot.status === 'available' ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(slot)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleDelete(slot._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageSlots;
