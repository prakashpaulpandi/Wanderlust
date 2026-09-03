import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { destinations } from '../../data/destinations';
import { searchDestinationImage, getImageSrc } from '../../services/imageService';
import { getSavedTripById, getSavedTripByDestination } from '../../services/storageService';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import FamousPlaces from '../../components/FamousPlaces/FamousPlaces';
import ChatBot from '../../components/ChatBot/ChatBot';
import ItineraryPlanner from '../../components/ItineraryPlanner/ItineraryPlanner';
import './DestinationDetail.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const destination = destinations.find((d) => d.id === id);

  const [heroImage, setHeroImage] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chat' | 'itinerary'
  const [savedTrip, setSavedTrip] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!destination) return;

    // Check if tripId is in search params or if user already saved a trip for this destination
    const tripId = searchParams.get('tripId');
    let loaded = null;
    if (tripId) {
      loaded = getSavedTripById(tripId);
    }
    if (!loaded) {
      loaded = getSavedTripByDestination(destination.id);
    }

    if (loaded) {
      setSavedTrip(loaded);
      setActiveTab('itinerary');
    } else if (searchParams.get('tab') === 'itinerary') {
      setActiveTab('itinerary');
    }
  }, [id, destination, searchParams]);

  useEffect(() => {
    if (!destination) return;
    let cancelled = false;
    const fetchHeroImg = async () => {
      try {
        const photos = await searchDestinationImage(`${destination.name} ${destination.country}`, 1);
        if (!cancelled && photos.length > 0) setHeroImage(photos[0]);
      } catch {
        // fallback handles
      } finally {
        if (!cancelled) setHeroLoading(false);
      }
    };
    fetchHeroImg();
    return () => { cancelled = true; };
  }, [destination]);

  if (!destination) {
    return (
      <main className="dest-detail-notfound">
        <div className="container">
          <div className="dest-detail-notfound__card">
            <span className="dest-detail-notfound__icon">🗺️</span>
            <h2>Destination Not Found</h2>
            <p>We couldn't find the destination you're looking for.</p>
            <Link to="/destinations" className="btn btn--primary">
              Back to Destinations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const heroSrc = heroImage ? getImageSrc(heroImage, 'large2x') || getImageSrc(heroImage, 'large') : null;

  return (
    <main className="dest-detail">
      {/* Hero Banner */}
      <div className="dest-detail__hero">
        <div className="dest-detail__hero-bg">
          {heroLoading && <div className="skeleton dest-detail__hero-skeleton" aria-hidden="true" />}
          {!heroLoading && heroSrc && (
            <img src={heroSrc} alt={destination.name} className="dest-detail__hero-img" />
          )}
          <div className="dest-detail__hero-overlay" />
        </div>

        <div className="container dest-detail__hero-content">
          <Link to="/destinations" className="dest-detail__back" id="back-to-destinations-link">
            ← Back to All Destinations
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="dest-detail__badges">
              <span className="badge badge--accent">{destination.continent}</span>
              {destination.category.map((cat) => (
                <span key={cat} className="badge badge--muted">{cat}</span>
              ))}
              {savedTrip && (
                <span className="badge badge--accent">✓ Saved Itinerary Preloaded</span>
              )}
            </div>

            <h1 className="dest-detail__title display-font">
              {destination.name}
            </h1>
            <p className="dest-detail__subtitle">{destination.country} • {destination.tagline}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container dest-detail__main">
        {/* Navigation Tabs */}
        <div className="dest-detail__tabs" role="tablist" aria-label="Destination sections">
          <button
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`dest-detail__tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            id="tab-overview"
          >
            Overview & Places
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'itinerary'}
            className={`dest-detail__tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
            id="tab-itinerary"
          >
            Itinerary Planner {savedTrip ? '(Saved Plan Active)' : ''}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'chat'}
            className={`dest-detail__tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            id="tab-chat"
          >
            AI Assistant Chat
          </button>
        </div>

        <div className="dest-detail__grid">
          {/* Main Area */}
          <div className="dest-detail__content">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="dest-detail__overview-section"
              >
                {/* Description */}
                <div className="dest-detail__card card">
                  <h2 className="dest-detail__card-title">About {destination.name}</h2>
                  <p className="dest-detail__card-text">{destination.description}</p>
                </div>

                {/* Famous Places */}
                <FamousPlaces places={destination.famousPlaces} destinationName={destination.name} />
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ItineraryPlanner
                  destination={destination}
                  initialItinerary={savedTrip?.daysData || null}
                  initialDays={savedTrip?.days || 3}
                  initialPref={savedTrip?.preferences || ''}
                />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChatBot destination={destination} />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="dest-detail__sidebar" aria-label="Destination sidebar info">
            {/* Live Weather Widget */}
            <div className="dest-detail__sidebar-box">
              <h3 className="dest-detail__sidebar-title">Live Weather</h3>
              <WeatherWidget lat={destination.lat} lon={destination.lon} cityName={destination.name} />
            </div>

            {/* AI Assistant Quick Card */}
            {activeTab !== 'chat' && (
              <div className="dest-detail__sidebar-card card">
                <h3>Have questions about {destination.name}?</h3>
                <p>Chat with our AI travel assistant for instant tips and advice.</p>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setActiveTab('chat')}
                >
                  Start Chat →
                </button>
              </div>
            )}

            {/* Quick Itinerary CTA Card */}
            {activeTab !== 'itinerary' && (
              <div className="dest-detail__sidebar-card card">
                <h3>{savedTrip ? 'View Saved Plan' : `Plan a trip to ${destination.name}`}</h3>
                <p>{savedTrip ? 'You have a saved trip plan for this destination.' : 'Generate a customized day-by-day itinerary tailored to your days & preferences.'}</p>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setActiveTab('itinerary')}
                >
                  {savedTrip ? 'Open Saved Plan →' : 'Generate Plan →'}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default DestinationDetail;
