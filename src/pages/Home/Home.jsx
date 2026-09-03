import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import LocationWeather from '../../components/LocationWeather/LocationWeather';
import { destinations } from '../../data/destinations';
import './Home.css';

const FEATURED_IDS = ['paris', 'tokyo', 'bali', 'santorini', 'kyoto', 'iceland'];

const Home = () => {
  const featured = destinations.filter((d) => FEATURED_IDS.includes(d.id));

  return (
    <main>
      <Hero />

      {/* Location + Weather section */}
      <section className="home-weather section" aria-labelledby="weather-section-heading">
        <div className="container">
          <div className="home-weather__grid">
            <div className="home-weather__text">
              <p className="section-label">Real-Time</p>
              <h2 id="weather-section-heading" className="section-title">
                Your Local Weather
              </h2>
              <p className="section-desc">
                Allow location access or search any city to see live weather conditions
                wherever you are in the world.
              </p>
            </div>
            <div className="home-weather__widget">
              <LocationWeather />
            </div>
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="home-featured section" aria-labelledby="featured-heading">
        <div className="container">
          <div className="home-featured__header">
            <div>
              <p className="section-label">Top Picks</p>
              <h2 id="featured-heading" className="section-title">Featured Destinations</h2>
              <p className="section-desc">
                Hand-picked destinations from around the globe. Each one with live weather,
                famous places, and a personalised AI itinerary.
              </p>
            </div>
            <Link to="/destinations" className="btn btn--outline home-featured__see-all" id="see-all-destinations-btn">
              See All 20 Destinations →
            </Link>
          </div>

          <div className="home-featured__grid" role="list">
            {featured.map((dest, i) => (
              <div key={dest.id} role="listitem">
                <DestinationCard destination={dest} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="home-features section" aria-labelledby="features-heading">
        <div className="container">
          <div className="home-features__header">
            <p className="section-label">Everything You Need</p>
            <h2 id="features-heading" className="section-title">Why Wanderlust?</h2>
          </div>

          <div className="home-features__grid" role="list">
            {[
              {
                icon: '🌤️',
                title: 'Live Weather',
                desc: 'Real-time weather data for any destination in the world, powered by OpenWeather.',
              },
              {
                icon: '🏛️',
                title: 'Famous Places',
                desc: 'Discover the iconic landmarks and hidden gems of every destination with stunning photos.',
              },
              {
                icon: '🤖',
                title: 'AI Companion',
                desc: 'Ask your AI travel assistant anything about a destination — travel tips, culture, cuisine.',
              },
              {
                icon: '📅',
                title: 'Itinerary Planner',
                desc: 'Generate a customised day-by-day travel plan instantly with AI. Adjust days and preferences.',
              },
              {
                icon: '📍',
                title: 'Location Aware',
                desc: 'Share your location or search any city to get personalised, relevant travel information.',
              },
              {
                icon: '📱',
                title: 'Fully Responsive',
                desc: 'Perfect on any screen — from desktop to mobile, the experience is always beautiful.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card card"
                role="listitem"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="feature-card__icon" aria-hidden="true">{feature.icon}</span>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta section" aria-labelledby="cta-heading">
        <div className="container">
          <motion.div
            className="home-cta__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="home-cta__glow" aria-hidden="true" />
            <p className="section-label">Ready to Explore?</p>
            <h2 id="cta-heading" className="home-cta__title display-font">
              Your Next Adventure
              <br />
              <em>Starts Here.</em>
            </h2>
            <p className="home-cta__desc">
              Browse 20 curated destinations, check live weather, and plan your trip with AI.
            </p>
            <Link to="/destinations" className="btn btn--primary btn--lg" id="cta-explore-btn">
              Explore All Destinations
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
