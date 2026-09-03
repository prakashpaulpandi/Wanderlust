import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { searchPlaceImages, getImageSrc } from '../../services/imageService';
import './FamousPlaces.css';

const PlaceCard = ({ place, destinationName, index }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const photos = await searchPlaceImages(`${place.name} ${destinationName}`, 1);
        if (!cancelled && photos.length > 0) setImage(photos[0]);
      } catch {
        // image stays null — show fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [place.name, destinationName]);

  const imgSrc = image ? getImageSrc(image, 'medium') : null;

  return (
    <motion.div
      className="place-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="place-card__img-wrap">
        {loading && <div className="skeleton place-card__skeleton" aria-hidden="true" />}
        {!loading && imgSrc && (
          <img
            src={imgSrc}
            alt={place.name}
            className="place-card__img"
            loading="lazy"
          />
        )}
        {!loading && !imgSrc && (
          <div className="place-card__fallback" aria-hidden="true">
            <span>🏛️</span>
          </div>
        )}
        <div className="place-card__overlay" />
        <span className="place-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="place-card__body">
        <h4 className="place-card__name">{place.name}</h4>
        <p className="place-card__desc">{place.description}</p>
      </div>
    </motion.div>
  );
};

const FamousPlaces = ({ places, destinationName }) => {
  return (
    <section className="famous-places" aria-labelledby="famous-places-heading">
      <div className="famous-places__header">
        <p className="section-label">Must-Visit</p>
        <h2 id="famous-places-heading" className="section-title">Famous Places</h2>
        <p className="section-desc">
          Discover the iconic landmarks and hidden gems that make {destinationName} unforgettable.
        </p>
      </div>
      <div className="famous-places__grid" role="list">
        {places.map((place, i) => (
          <div key={place.name} role="listitem">
            <PlaceCard
              place={place}
              destinationName={destinationName}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FamousPlaces;
