import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedTrips } from '../../services/storageService';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const updateState = () => {
    setSavedCount(getSavedTrips().length);
    const savedUser = localStorage.getItem('wanderlust_user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  useEffect(() => {
    updateState();
    window.addEventListener('storage-updated', updateState);
    window.addEventListener('user-updated', updateState);
    return () => {
      window.removeEventListener('storage-updated', updateState);
      window.removeEventListener('user-updated', updateState);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="Wanderlust Home">
          <svg className="navbar__logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.5-.1-.9.1-1.1.5l-.8 1.4c-.2.4-.1.9.3 1.2l4.8 3.8-2.6 2.6-2.1-.5c-.3-.1-.7 0-.9.2l-.7.7c-.2.2-.2.6 0 .8l2.5 2.5c.2.2.6.2.8 0l.7-.7c.2-.2.3-.6.2-.9l-.5-2.1 2.6-2.6 3.8 4.8c.3.4.8.5 1.2.3l1.4-.8c.4-.2.6-.6.5-1.1z"/>
          </svg>
          <span className="navbar__logo-text">Wanderlust</span>
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/destinations"
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            Destinations
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) => `navbar__link navbar__profile-tag ${isActive ? 'active' : ''}`}
            id="nav-my-trips"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>My Trips</span>
            {savedCount > 0 && (
              <span className="navbar__badge">{savedCount}</span>
            )}
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => `navbar__link navbar__user-btn ${isActive ? 'active' : ''}`}
            id="nav-login"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{user ? user.name : 'Sign In'}</span>
          </NavLink>
        </nav>

        <button
          className="navbar__menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`} aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <nav className="navbar__mobile-links">
              <NavLink to="/" end className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
              <NavLink to="/destinations" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}>
                Destinations
              </NavLink>
              <NavLink to="/saved" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}>
                My Trips ({savedCount})
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}>
                {user ? `Account (${user.name})` : 'Sign In / Register'}
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
