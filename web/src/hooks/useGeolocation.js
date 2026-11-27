/**
 * useGeolocation: browser Geolocation API hook.
 * Handles permission, unavailability, and errors with appropriate states.
 * Web browsers use the browser's native geolocation permission system.
 */
import { useState, useCallback, useEffect } from 'react';

const LOCATION_TIMEOUT_MS = 10000;
const LOCATION_MAX_AGE_MS = 300000; // 5 minutes

export const LOCATION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  DENIED: 'denied',
  UNAVAILABLE: 'unavailable',
  TIMEOUT: 'timeout',
  ERROR: 'error',
};

const useGeolocation = () => {
  const [state, setState] = useState(LOCATION_STATES.IDLE);
  const [coords, setCoords] = useState(null); // { latitude, longitude, accuracy }
  const [error, setError] = useState(null);

  const isSupported = 'geolocation' in navigator;

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setState(LOCATION_STATES.UNAVAILABLE);
      setError('Your browser does not support geolocation.');
      return;
    }

    setState(LOCATION_STATES.LOADING);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setState(LOCATION_STATES.SUCCESS);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setState(LOCATION_STATES.DENIED);
            setError(
              'Location access was denied. Please enable location permission in your browser settings to get accurate weather and agriculture data.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setState(LOCATION_STATES.UNAVAILABLE);
            setError(
              'Location information is unavailable. Please check your device location settings.'
            );
            break;
          case err.TIMEOUT:
            setState(LOCATION_STATES.TIMEOUT);
            setError('Location request timed out. Please try again.');
            break;
          default:
            setState(LOCATION_STATES.ERROR);
            setError('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: LOCATION_TIMEOUT_MS,
        maximumAge: LOCATION_MAX_AGE_MS,
      }
    );
  }, [isSupported]);

  // Auto-request on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const openLocationSettings = useCallback(() => {
    // On web, open the browser's settings page for the site
    // This cannot be done programmatically; guide the user instead
    alert(
      'To enable location:\n' +
        '1. Click the lock/info icon in your browser address bar\n' +
        '2. Find "Location" under Permissions\n' +
        '3. Set it to "Allow"\n' +
        '4. Refresh this page'
    );
  }, []);

  return {
    state,
    coords,
    error,
    isSupported,
    requestLocation,
    openLocationSettings,
    isLoading: state === LOCATION_STATES.LOADING,
    isSuccess: state === LOCATION_STATES.SUCCESS,
    isDenied: state === LOCATION_STATES.DENIED,
  };
};

export default useGeolocation;
