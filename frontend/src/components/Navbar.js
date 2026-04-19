import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenu(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand">
          <span className="brand-icon">🌬️</span>
          <span className="brand-name">breeze<em>travel</em></span>
        </Link>

        <div className="nav-right">
          {user && (
            <Link to="/create" className="host-link">+ Add Listing</Link>
          )}
          <div className="user-menu" onClick={() => setMenu(!menu)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <div className="avatar-circle">
              {user ? user.name[0].toUpperCase() : '?'}
            </div>
          </div>
          {menu && (
            <div className="dropdown">
              {user ? (
                <>
                  <div className="dropdown-user">Hi, {user.name.split(' ')[0]} 👋</div>
                  <Link to="/my-bookings" onClick={() => setMenu(false)}>My Bookings</Link>
                  <Link to="/create" onClick={() => setMenu(false)}>Add Listing</Link>
                  <button onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenu(false)}>Log in</Link>
                  <Link to="/register" onClick={() => setMenu(false)}>Sign up</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
