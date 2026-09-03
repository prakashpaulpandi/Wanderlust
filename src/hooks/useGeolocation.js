import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    coordinates: null,
    denied: false,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null, denied: false }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          denied: false,
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState({
          loading: false,
          error: denied
            ? 'Location permission denied. You can search for a city below.'
            : 'Unable to retrieve your location. Please try again.',
          denied,
          coordinates: null,
        });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return { ...state, requestLocation };
};
