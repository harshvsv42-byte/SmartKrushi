import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { locationApi, weatherApi } from '../api/services';

const AppContext = createContext(null);

const DEFAULT_LOCATION = {
  latitude: 23.0225,
  longitude: 72.5714,
  district: 'Ahmedabad',
  districtId: 2,
  state: 'Gujarat',
  stateId: 1,
  isGps: false,
};

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // 1. Language State (persisted in localStorage)
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || i18n.language || 'gu';
  });

  const setLanguage = useCallback((lang) => {
    setSelectedLanguageState(lang);
    localStorage.setItem('app_language', lang);
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Ensure i18n is in sync on mount
  useEffect(() => {
    if (selectedLanguage && i18n.language !== selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  // 2. Location State
  const [location, setLocationState] = useState(() => {
    try {
      const cached = sessionStorage.getItem('app_location');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return DEFAULT_LOCATION;
  });

  const [permissionStatus, setPermissionStatus] = useState(() => {
    return sessionStorage.getItem('app_location_permission') || 'prompt';
  });
  const [permissionError, setPermissionError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // 3. Category & Crop State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);

  // 4. Cached Weather State
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Request GPS Location from device & resolve with Django backend
  const requestDeviceLocation = useCallback((force = false) => {
    // If not forced and already obtained GPS in this session, don't ask again
    if (!force && sessionStorage.getItem('app_location_resolved') === 'true') {
      return;
    }

    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      setPermissionError(
        'તમારા બ્રાઉઝરમાં જીપીએસ / લોકેશન સપોર્ટ ઉપલબ્ધ નથી. ડિફોલ્ટ જિલ્લો વાપરવામાં આવી રહ્યો છે.'
      );
      return;
    }

    setIsLoadingLocation(true);
    setPermissionError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Send GPS coordinates to Django backend
          const res = await locationApi.locate(lat, lon);
          if (res.data && res.data.success) {
            const locData = {
              latitude: lat,
              longitude: lon,
              district: res.data.district || 'Gujarat',
              districtId: res.data.district_id,
              state: res.data.state || 'Gujarat',
              stateId: res.data.state_id,
              isGps: true,
            };

            setLocationState(locData);
            setPermissionStatus('granted');
            sessionStorage.setItem('app_location', JSON.stringify(locData));
            sessionStorage.setItem('app_location_resolved', 'true');
            sessionStorage.setItem('app_location_permission', 'granted');
          } else {
            // Fallback with coordinates
            setLocationState((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lon,
              isGps: true,
            }));
          }
        } catch (err) {
          console.warn('Backend locate resolution failed, using coordinates:', err);
          setLocationState((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
            isGps: true,
          }));
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        setIsLoadingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          sessionStorage.setItem('app_location_permission', 'denied');
          setPermissionError(
            'સ્થાન પરવાનગી નકારી દેવામાં આવી છે. તમારા વિસ્તારનું સચોટ હવામાન અને માટીની માહિતી મેળવવા માટે કૃપા કરીને સ્થાન પરવાનગી આપો.'
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setPermissionStatus('unavailable');
          setPermissionError('ઉપકરણનું જીપીએસ સ્થાન ઉપલબ્ધ નથી.');
        } else {
          setPermissionStatus('error');
          setPermissionError('સ્થાન મેળવતી વખતે સમસ્યા આવી.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Startup: Request location on initial app load if not resolved
  useEffect(() => {
    requestDeviceLocation(false);
  }, [requestDeviceLocation]);

  // Set Manual District (e.g. from header modal)
  const setManualDistrict = useCallback((districtObj) => {
    if (!districtObj) return;
    const newLoc = {
      latitude: districtObj.latitude || DEFAULT_LOCATION.latitude,
      longitude: districtObj.longitude || DEFAULT_LOCATION.longitude,
      district: districtObj.district_name || districtObj.name || DEFAULT_LOCATION.district,
      districtId: districtObj.id || DEFAULT_LOCATION.districtId,
      state: districtObj.state_name || districtObj.state || 'Gujarat',
      stateId: districtObj.state_id || 1,
      isGps: districtObj.name === 'My Location',
    };
    setLocationState(newLoc);
    sessionStorage.setItem('app_location', JSON.stringify(newLoc));
  }, []);

  // Fetch weather whenever location changes
  const fetchWeather = useCallback(async () => {
    if (!location?.latitude || !location?.longitude) return;
    setIsLoadingWeather(true);
    try {
      const res = await weatherApi.get(location.latitude, location.longitude, location.district);
      if (res.data) {
        setWeatherData(res.data);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const value = {
    // Location
    location,
    selectedDistrict: location,
    setSelectedDistrict: setManualDistrict,
    permissionStatus,
    permissionError,
    isLoadingLocation,
    requestDeviceLocation,
    setManualDistrict,
    clearLocationError: () => setPermissionError(null),

    // Weather
    weatherData,
    weather: weatherData,
    isLoadingWeather,
    loadingWeather: isLoadingWeather,
    refreshWeather: fetchWeather,

    // Language
    selectedLanguage,
    setLanguage,

    // Category & Crop
    selectedCategory,
    setSelectedCategory,
    selectedCrop,
    setSelectedCrop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
