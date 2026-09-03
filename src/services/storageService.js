// LocalStorage manager for Saved Trips and Favorites
const SAVED_TRIPS_KEY = 'wanderlust_saved_trips';
const SAVED_DESTINATIONS_KEY = 'wanderlust_saved_destinations';

export const getSavedTrips = () => {
  try {
    const data = localStorage.getItem(SAVED_TRIPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTrip = (trip) => {
  try {
    const trips = getSavedTrips();
    // Check if trip for destination & days already exists, update or append
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = { ...trip, savedAt: Date.now() };
    } else {
      trips.unshift({ ...trip, id: trip.id || `trip_${Date.now()}`, savedAt: Date.now() });
    }
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
    window.dispatchEvent(new Event('storage-updated'));
    return true;
  } catch {
    return false;
  }
};

export const removeSavedTrip = (tripId) => {
  try {
    const trips = getSavedTrips().filter(t => t.id !== tripId);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
    window.dispatchEvent(new Event('storage-updated'));
    return true;
  } catch {
    return false;
  }
};

export const getSavedDestinations = () => {
  try {
    const data = localStorage.getItem(SAVED_DESTINATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleSaveDestination = (destId) => {
  try {
    const saved = getSavedDestinations();
    let updated;
    if (saved.includes(destId)) {
      updated = saved.filter(id => id !== destId);
    } else {
      updated = [...saved, destId];
    }
    localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage-updated'));
    return updated.includes(destId);
  } catch {
    return false;
  }
};

export const isDestinationSaved = (destId) => {
  return getSavedDestinations().includes(destId);
};
