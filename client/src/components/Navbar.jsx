import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Smart Parking System</h2>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/slots">Manage Slots</Link>
                <Link to="/admin/zones">Manage Zones</Link>
                <Link to="/admin/bookings">All Bookings</Link>
              </>
            ) : (
              <>
                <Link to="/slots">Available Slots</Link>
                <Link to="/my-bookings">My Bookings</Link>
              </>
            )}
            <span className="user-info">
              {user.name} ({user.role})
            </span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <Link to="/login">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
