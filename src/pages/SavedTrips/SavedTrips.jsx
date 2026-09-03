import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedTrips, removeSavedTrip, getSavedDestinations } from '../../services/storageService';
import { destinations } from '../../data/destinations';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import './SavedTrips.css';

const SavedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'favorites'

  const refreshData = () => {
    setTrips(getSavedTrips());
    setFavoriteIds(getSavedDestinations());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage-updated', refreshData);
    return () => window.removeEventListener('storage-updated', refreshData);
  }, []);

  const handleRemoveTrip = (id) => {
    removeSavedTrip(id);
    refreshData();
  };

  const favoriteDestinations = destinations.filter(d => favoriteIds.includes(d.id));

  return (
    <main className="saved-trips-page">
      {/* Header */}
      <div className="saved-trips-page__hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="saved-trips-page__profile-header">
              <div className="saved-trips-page__avatar" aria-hidden="true">
                <span>👤</span>
              </div>
              <div>
                <p className="section-label">User Profile</p>
                <h1 className="saved-trips-page__title">My Travel Vault</h1>
                <p className="saved-trips-page__subtitle">
                  Your saved AI itineraries & favorite destinations stored for future reference.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container saved-trips-page__main">
        {/* Navigation Tabs */}
        <div className="saved-trips-page__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'trips'}
            className={`saved-trips-page__tab ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            🔖 Saved Itineraries ({trips.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'favorites'}
            className={`saved-trips-page__tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ❤️ Bookmarked Places ({favoriteDestinations.length})
          </button>
        </div>

        {/* Tab 1: Saved Trips */}
        {activeTab === 'trips' && (
          <div className="saved-trips-list">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  className="saved-trip-card card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="saved-trip-card__header">
                    <div>
                      <span className="badge badge--accent">{trip.days} Days Plan</span>
                      <h3 className="saved-trip-card__title">
                        {trip.destinationName}, {trip.country}
                      </h3>
                      {trip.preferences && (
                        <p className="saved-trip-card__pref">Preferences: {trip.preferences}</p>
                      )}
                      <p className="saved-trip-card__date">
                        Saved on {new Date(trip.savedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="saved-trip-card__actions">
                      <Link
                        to={`/destination/${trip.destinationId}`}
                        className="btn btn--primary btn--sm"
                      >
                        View Destination →
                      </Link>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => handleRemoveTrip(trip.id)}
                      >
                        Remove 🗑️
                      </button>
                    </div>
                  </div>

                  {/* Summary Days */}
                  <div className="saved-trip-card__days">
                    {trip.daysData.map((d) => (
                      <div key={d.day} className="saved-trip-card__day-summary">
                        <span className="saved-trip-card__day-badge">Day {d.day}</span>
                        <div>
                          <strong>{d.title}</strong>
                          <p>{d.morning?.activity} • {d.evening?.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="saved-trips-empty">
                <span className="saved-trips-empty__icon">📑</span>
                <h3>No Saved Trips Yet</h3>
                <p>Generate an itinerary on any destination page and click "Save Trip" to store it here.</p>
                <Link to="/destinations" className="btn btn--primary">
                  Explore Destinations
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookmarked Places */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteDestinations.length > 0 ? (
              <div className="destinations-grid">
                {favoriteDestinations.map((dest, i) => (
                  <DestinationCard key={dest.id} destination={dest} index={i} />
                ))}
              </div>
            ) : (
              <div className="saved-trips-empty">
                <span className="saved-trips-empty__icon">❤️</span>
                <h3>No Bookmarked Destinations</h3>
                <p>Click the bookmark icon on any destination card to save your favorite places here.</p>
                <Link to="/destinations" className="btn btn--primary">
                  Browse Destinations
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedTrips;
