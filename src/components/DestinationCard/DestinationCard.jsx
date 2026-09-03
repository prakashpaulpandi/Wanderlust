import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchDestinationImage, getImageSrc } from '../../services/imageService';
import { isDestinationSaved, toggleSaveDestination } from '../../services/storageService';
import './DestinationCard.css';

const DestinationCard = ({ destination, index = 0 }) => {
  const [image, setImage] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isDestinationSaved(destination.id));
  }, [destination.id]);

  useEffect(() => {
    let cancelled = false;
    const loadImage = async () => {
      try {
        const photos = await searchDestinationImage(`${destination.name} ${destination.country}`);
        if (!cancelled && photos.length > 0) {
          setImage(photos[0]);
        }
      } catch {
        if (!cancelled) setImgError(true);
      } finally {
        if (!cancelled) setImgLoading(false);
      }
    };
    loadImage();
    return () => { cancelled = true; };
  }, [destination.name, destination.country]);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedStatus = toggleSaveDestination(destination.id);
    setIsSaved(updatedStatus);
  };

  const imgSrc = image ? getImageSrc(image, 'large') : null;

  return (
    <motion.article
      className="dest-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/destination/${destination.id}`}
        className="dest-card__link"
        aria-label={`Explore ${destination.name}, ${destination.country}`}
      >
        {/* Image */}
        <div className="dest-card__img-wrap">
          {imgLoading && <div className="dest-card__skeleton skeleton" aria-hidden="true" />}
          {!imgLoading && !imgError && imgSrc && (
            <img
              src={imgSrc}
              alt={`${destination.name}, ${destination.country}`}
              className="dest-card__img"
              loading="lazy"
            />
          )}
          {(imgError || (!imgLoading && !imgSrc)) && (
            <div className="dest-card__img-fallback" aria-hidden="true">
              <span className="dest-card__img-fallback-icon">🌍</span>
            </div>
          )}
          <div className="dest-card__img-overlay" />

          {/* Continent badge */}
          <span className="dest-card__continent badge badge--accent">
            {destination.continent}
          </span>

          {/* Bookmark Button */}
          <button
            type="button"
            className={`dest-card__bookmark-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleBookmark}
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark destination'}
            title={isSaved ? 'Remove bookmark' : 'Bookmark destination'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Body */}
        <div className="dest-card__body">
          <div className="dest-card__meta">
            <h3 className="dest-card__name">{destination.name}</h3>
            <p className="dest-card__country">{destination.country}</p>
          </div>
          <p className="dest-card__tagline">{destination.tagline}</p>

          {/* Categories */}
          <div className="dest-card__tags" aria-label="Categories">
            {destination.category.slice(0, 3).map((cat) => (
              <span key={cat} className="tag">{cat}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="dest-card__footer">
            <span className="dest-card__places-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {destination.famousPlaces.length} places to visit
            </span>
            <span className="dest-card__arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default DestinationCard;
