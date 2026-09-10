import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ManageSlots from './pages/ManageSlots';
import ManageZones from './pages/ManageZones';
import AllBookings from './pages/AllBookings';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} onLogout={handleLogout} />

        <div className="container">
          <Routes>
            {/* Public / Auth */}
            <Route
              path="/login"
              element={
                !user ? (
                  <Login setUser={setUser} />
                ) : (
                  <Navigate to={user.role === 'admin' ? '/admin' : '/slots'} />
                )
              }
            />

            {/* User Routes */}
            <Route
              path="/slots"
              element={user ? <UserDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-bookings"
              element={user ? <MyBookings /> : <Navigate to="/login" />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/slots"
              element={
                user && user.role === 'admin' ? (
                  <ManageSlots />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/zones"
              element={
                user && user.role === 'admin' ? (
                  <ManageZones />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/bookings"
              element={
                user && user.role === 'admin' ? (
                  <AllBookings />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Fallback Root */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    user
                      ? user.role === 'admin'
                        ? '/admin'
                        : '/slots'
                      : '/login'
                  }
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
