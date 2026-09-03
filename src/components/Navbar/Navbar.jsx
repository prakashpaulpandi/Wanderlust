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
          <span className="navbar__logo-icon">✈</span>
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
            <span className="navbar__profile-avatar">👤</span>
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
