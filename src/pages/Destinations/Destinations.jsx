import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import { destinations, continents, categories } from '../../data/destinations';
import { useDebounce } from '../../hooks/useDebounce';
import './Destinations.css';

const Destinations = () => {
  const [search, setSearch] = useState('');
  const [activeContinent, setActiveContinent] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchSearch =
        !debouncedSearch ||
        d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        d.country.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        d.tagline.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchContinent =
        activeContinent === 'All' || d.continent === activeContinent;

      const matchCategory =
        activeCategory === 'All' || d.category.includes(activeCategory);

      return matchSearch && matchContinent && matchCategory;
    });
  }, [debouncedSearch, activeContinent, activeCategory]);

  const clearFilters = () => {
    setSearch('');
    setActiveContinent('All');
    setActiveCategory('All');
  };

  const hasActiveFilters =
    search || activeContinent !== 'All' || activeCategory !== 'All';

  return (
    <main className="destinations-page">
      {/* Page header */}
      <div className="destinations-page__hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label">World Explorer</p>
            <h1 className="destinations-page__title">
              Discover{' '}
              <span className="destinations-page__title-accent">Destinations</span>
            </h1>
            <p className="destinations-page__subtitle">
              Explore {destinations.length} curated destinations across 6 continents.
              Search, filter, and find your perfect next adventure.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="destinations-filters" aria-label="Filter destinations">
        <div className="container destinations-filters__inner">
          {/* Search */}
          <div className="destinations-filters__search-wrap">
            <label htmlFor="destination-search" className="sr-only">Search destinations</label>
            <svg
              className="destinations-filters__search-icon"
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              id="destination-search"
              type="search"
              className="input destinations-filters__search"
              placeholder="Search destinations, countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search destinations"
            />
          </div>

          <div className="destinations-filters__rows">
            {/* Continent filter */}
            <div className="destinations-filters__row" role="group" aria-label="Filter by continent">
              <span className="destinations-filters__label">Continent</span>
              <div className="destinations-filters__tags">
                {continents.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tag ${activeContinent === c ? 'active' : ''}`}
                    onClick={() => setActiveContinent(c)}
                    aria-pressed={activeContinent === c}
                    id={`continent-${c.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="destinations-filters__row" role="group" aria-label="Filter by category">
              <span className="destinations-filters__label">Category</span>
              <div className="destinations-filters__tags">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`tag ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    id={`category-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result count + clear */}
          <div className="destinations-filters__meta">
            <p className="destinations-filters__count" aria-live="polite">
              <span className="destinations-filters__count-num">{filtered.length}</span>
              {filtered.length === 1 ? ' destination' : ' destinations'} found
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={clearFilters}
                id="clear-filters-btn"
                aria-label="Clear all filters"
              >
                Clear filters ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              className="destinations-grid"
              role="list"
              aria-label="Destination list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filtered.map((dest, i) => (
                <div key={dest.id} role="listitem">
                  <DestinationCard destination={dest} index={i} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="destinations-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              aria-live="polite"
            >
              <span className="destinations-empty__icon" aria-hidden="true">🔍</span>
              <h2 className="destinations-empty__title">No destinations found</h2>
              <p className="destinations-empty__desc">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={clearFilters}
                id="reset-filters-btn"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Destinations;
