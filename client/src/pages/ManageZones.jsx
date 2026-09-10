import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function ManageZones() {
  const [zones, setZones] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/zones`);
      const data = await res.json();
      setZones(data);
    } catch (err) {
      setError('Error fetching zones');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !location) {
      setError('Please fill in both zone name and location');
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/zones/${editingId}`
        : `${API_URL}/api/zones`;

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, location })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error saving zone');
      } else {
        setMessage(editingId ? 'Zone updated' : 'Zone created');
        setName('');
        setLocation('');
        setEditingId(null);
        fetchZones();
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleEdit = (zone) => {
    setEditingId(zone._id);
    setName(zone.name);
    setLocation(zone.location);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this zone?')) return;
    try {
      const res = await fetch(`${API_URL}/api/zones/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Zone deleted');
        fetchZones();
      }
    } catch (err) {
      setError('Error deleting zone');
    }
  };

  return (
    <div>
      <h2>Manage Parking Zones</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-form-box">
        <h3>{editingId ? 'Edit Zone' : 'Add New Zone'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Zone Name</label>
            <input
              type="text"
              placeholder="e.g. Zone A, VIP Section"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location / Description</label>
            <input
              type="text"
              placeholder="e.g. Near Entry Gate 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Zone' : 'Create Zone'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setEditingId(null); setName(''); setLocation(''); }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <h3>All Zones</h3>
      {zones.length === 0 ? (
        <p>No zones added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone._id}>
                <td><strong>{zone.name}</strong></td>
                <td>{zone.location}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(zone)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleDelete(zone._id)}
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

export default ManageZones;
