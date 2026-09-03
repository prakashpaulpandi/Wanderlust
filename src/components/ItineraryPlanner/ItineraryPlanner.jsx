import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateItinerary } from '../../services/geminiService';
import { saveTrip } from '../../services/storageService';
import './ItineraryPlanner.css';

const DayCard = ({ day, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  const periods = [
    { key: 'morning', label: 'Morning', icon: '🌅' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { key: 'evening', label: 'Evening', icon: '🌙' },
  ];

  return (
    <motion.article
      className="day-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <button
        className="day-card__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={`day-${day.day}-content`}
        type="button"
      >
        <div className="day-card__header-left">
          <span className="day-card__number">Day {day.day}</span>
          <div>
            <h3 className="day-card__title">{day.title}</h3>
            <p className="day-card__theme">{day.theme}</p>
          </div>
        </div>
        <motion.span
          className="day-card__chevron"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`day-${day.day}-content`}
            className="day-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="day-card__periods">
              {periods.map(({ key, label, icon }) => {
                const period = day[key];
                if (!period) return null;
                return (
                  <div key={key} className="day-card__period">
                    <div className="day-card__period-header">
                      <span className="day-card__period-icon" aria-hidden="true">{icon}</span>
                      <span className="day-card__period-label">{label}</span>
                    </div>
                    <div className="day-card__period-content">
                      <h4 className="day-card__activity">{period.activity}</h4>
                      <p className="day-card__activity-desc">{period.description}</p>
                      {period.tip && (
                        <div className="day-card__tip">
                          <span aria-hidden="true">💡</span>
                          <span>{period.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="day-card__footer">
              {day.accommodation && (
                <div className="day-card__footer-item">
                  <span aria-hidden="true">🏨</span>
                  <span><strong>Stay:</strong> {day.accommodation}</span>
                </div>
              )}
              {day.estimatedCost && (
                <div className="day-card__footer-item">
                  <span aria-hidden="true">💰</span>
                  <span><strong>Est. Cost:</strong> {day.estimatedCost}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

const ItineraryPlanner = ({ destination }) => {
  const [days, setDays] = useState(3);
  const [preferences, setPreferences] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setIsSaved(false);
    try {
      const result = await generateItinerary(destination, days, preferences);
      setItinerary(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!itinerary) return;
    const tripData = {
      id: `${destination.id}_${days}d_${Date.now()}`,
      destinationId: destination.id,
      destinationName: destination.name,
      country: destination.country,
      days,
      preferences,
      daysData: itinerary,
    };
    saveTrip(tripData);
    setIsSaved(true);
  };

  return (
    <section className="itinerary" aria-labelledby="itinerary-heading">
      <div className="itinerary__header">
        <p className="section-label">AI-Powered</p>
        <h2 id="itinerary-heading" className="section-title">Trip Itinerary</h2>
        <p className="section-desc">
          Get a personalised, day-by-day travel plan for {destination.name} — crafted by AI.
        </p>
      </div>

      {/* Controls */}
      <div className="itinerary__controls">
        <div className="itinerary__control-group">
          <label htmlFor="itinerary-days" className="itinerary__label">
            Number of Days
          </label>
          <div className="itinerary__days-picker">
            {[2, 3, 5, 7, 10].map((d) => (
              <button
                key={d}
                type="button"
                className={`itinerary__day-btn ${days === d ? 'active' : ''}`}
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                id={`days-btn-${d}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <div className="itinerary__control-group">
          <label htmlFor="itinerary-prefs" className="itinerary__label">
            Preferences (optional)
          </label>
          <input
            id="itinerary-prefs"
            type="text"
            className="input"
            placeholder="e.g. budget travel, vegetarian, family with kids, adventure..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            disabled={loading}
            maxLength={200}
          />
        </div>

        <button
          type="button"
          className="btn btn--primary itinerary__generate-btn"
          onClick={handleGenerate}
          disabled={loading}
          id="generate-itinerary-btn"
          aria-label={`Generate ${days}-day itinerary for ${destination.name}`}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 18, height: 18 }} />
              <span>Crafting your itinerary...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Generate {days}-Day Itinerary</span>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="itinerary__error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <div>
            <p className="itinerary__error-title">Failed to generate itinerary</p>
            <p className="itinerary__error-msg">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="itinerary__loading" aria-busy="true" aria-live="polite">
          <div className="itinerary__loading-icon" aria-hidden="true">🗺️</div>
          <p className="itinerary__loading-text">
            AI is crafting your perfect {days}-day itinerary for {destination.name}...
          </p>
          <div className="itinerary__loading-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* Itinerary */}
      <AnimatePresence>
        {itinerary && itinerary.length > 0 && (
          <motion.div
            className="itinerary__result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="itinerary__result-header">
              <div className="itinerary__result-badge">
                <span aria-hidden="true">✨</span>
                <span>Your {days}-Day {destination.name} Itinerary</span>
              </div>
              <div className="itinerary__result-actions">
                <button
                  type="button"
                  className={`btn ${isSaved ? 'btn--primary' : 'btn--outline'} btn--sm`}
                  onClick={handleSaveTrip}
                  id="save-trip-btn"
                  aria-label="Save this trip to profile"
                >
                  {isSaved ? '✓ Saved to My Trips' : '🔖 Save Trip'}
                </button>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={handleGenerate}
                  id="regenerate-itinerary-btn"
                  aria-label="Regenerate itinerary"
                >
                  Regenerate
                </button>
              </div>
            </div>
            <div className="itinerary__days" role="list">
              {itinerary.map((day, i) => (
                <div key={day.day} role="listitem">
                  <DayCard day={day} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ItineraryPlanner;
