import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedTrips } from '../../services/storageService';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const location = useLocation();

  const updateCount = () => {
    setSavedCount(getSavedTrips().length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('storage-updated', updateCount);
    return () => window.removeEventListener('storage-updated', updateCount);
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
            <span className="navbar__profile-avatar">👤</span>
            <span>My Trips</span>
            {savedCount > 0 && (
              <span className="navbar__badge">{savedCount}</span>
            )}
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
