/**
 * Centralized API service layer. All backend calls go through these functions.
 */
import apiClient from './client';

// ─── Authentication ───────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => apiClient.post('/auth/register/', data),
  login: (username, password) => apiClient.post('/auth/login/', { username, password }),
  refreshToken: (refreshToken) => apiClient.post('/auth/token/refresh/', { refresh: refreshToken }),
  logout: (refreshToken) => apiClient.post('/auth/logout/', { refresh: refreshToken }),
};

// ─── User Profile ─────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => apiClient.get('/auth/profile/'),
  update: (data) => {
    if (data instanceof FormData) {
      return apiClient.patch('/auth/profile/', data, {
        headers: { 'Content-Type': undefined }
      });
    }
    const hasFile = Object.values(data).some(v => v instanceof File || v instanceof Blob);
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return apiClient.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': undefined }
      });
    }
    return apiClient.patch('/auth/profile/', data);
  },
  updateLanguage: (language) => apiClient.post('/auth/profile/language/', { language }),
};

// ─── Location ─────────────────────────────────────────────────────────────────
export const locationApi = {
  locate: (latitude, longitude) => apiClient.get('/locations/districts/locate/', { params: { latitude, longitude } }),
  update: (latitude, longitude, locationName = '') => apiClient.post('/locations/districts/locate/', { latitude, longitude, location_name: locationName }),
  listDistricts: (state = '') => apiClient.get('/locations/districts/', { params: state ? { state } : {} }),
  listStates: () => apiClient.get('/locations/states/'),
};

// ─── Weather ──────────────────────────────────────────────────────────────────
export const weatherApi = {
  get: (lat, lon, district = '') => {
    const params = {};
    if (lat !== undefined && lon !== undefined) {
      params.latitude = lat;
      params.longitude = lon;
    }
    if (district) params.district = district;
    return apiClient.get('/weather/current/', { params });
  },
  getDetails: (lat, lon, district = '', state = '') => {
    const params = {};
    if (lat !== undefined && lon !== undefined) {
      params.latitude = lat;
      params.longitude = lon;
    }
    if (district) params.district = district;
    if (state) params.state = state;
    return apiClient.get('/weather/details/', { params });
  },
  getForecast: (lat, lon, days = 7) => {
    const params = { days };
    if (lat !== undefined && lon !== undefined) {
      params.latitude = lat;
      params.longitude = lon;
    }
    return apiClient.get('/weather/forecast/', { params });
  },
  getSummary: (district = '') => apiClient.get('/weather/summary/', { params: district ? { district } : {} }),
};

// ─── Soil ─────────────────────────────────────────────────────────────────────
export const soilApi = {
  getByCoordinates: (lat, lon, district = '') => {
    const params = {};
    if (lat !== undefined && lon !== undefined) {
      params.latitude = lat;
      params.longitude = lon;
    }
    if (district) params.district = district;
    return apiClient.get('/soil/by-coordinates/', { params });
  },
  get: (districtName = '', districtId = null, lat = null, lon = null) => {
    const params = {};
    if (districtId) params.district_id = districtId;
    else if (districtName) params.district = districtName;
    if (lat && lon) {
      params.latitude = lat;
      params.longitude = lon;
    }
    return apiClient.get('/soil/by-coordinates/', { params });
  },
  analysis: (soilId = null) => apiClient.get('/soil/analysis/', { params: soilId ? { soil_id: soilId } : {} }),
};

// ─── Crops ────────────────────────────────────────────────────────────────────
export const cropApi = {
  list: (params = {}) => apiClient.get('/crops/', { params }),
  getCategories: (lang = '') => apiClient.get('/crops/categories/', { params: lang ? { lang } : {} }),
  getDetails: (id, lang = '') => apiClient.get(`/crops/${id}/`, { params: lang ? { lang } : {} }),
  getSuitableForSoil: (soilType = '', soilPh = null, lang = '') => {
    const params = {};
    if (soilType) params.soil_type = soilType;
    if (soilPh !== null && soilPh !== undefined) params.soil_ph = soilPh;
    if (lang) params.lang = lang;
    return apiClient.get('/crops/suitable-for-soil/', { params });
  },
  getBySeason: (season = '', lang = '') => {
    const params = { season };
    if (lang) params.lang = lang;
    return apiClient.get('/crops/by-season/', { params });
  },
  getByLocation: (district = '', state = '', lang = '') => {
    const params = {};
    if (district) params.district = district;
    if (state) params.state = state;
    if (lang) params.lang = lang;
    return apiClient.get('/crops/by-location/', { params });
  },
};

// ─── Recommendations ──────────────────────────────────────────────────────────
export const recommendationsApi = {
  evaluate: (params = {}) => apiClient.get('/recommendations/', { params }),
  cropSuitability: (params = {}) => apiClient.get('/recommendations/crop-suitability/', { params }),
  fertilizerGuidance: (params = {}) => apiClient.get('/recommendations/fertilizer-guidance/', { params }),
};

// ─── Market ───────────────────────────────────────────────────────────────────
export const marketApi = {
  prices: (districtOrParams = null, crop = '') => {
    let params = {};
    if (typeof districtOrParams === 'object' && districtOrParams !== null) {
      params = districtOrParams;
    } else {
      if (districtOrParams) params.district = districtOrParams;
      if (crop) params.crop = crop;
    }
    return apiClient.get('/market/prices/', { params });
  },
  schemes: (state = '') => {
    const params = {};
    if (state) params.state = state;
    return apiClient.get('/market/schemes/', { params });
  },
  calendar: () => apiClient.get('/market/calendar/'),
};

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const alertsApi = {
  list: (districtId = null) => {
    const params = {};
    if (districtId) params.district_id = districtId;
    return apiClient.get('/alerts/', { params });
  },
  briefing: () => apiClient.get('/alerts/briefing/'),
};

// ─── Diagnostics ──────────────────────────────────────────────────────────────
export const diagnosticsApi = {
  list: () => apiClient.get('/diagnostics/'),
  submit: (imageFile, locationDescription = '') => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (locationDescription) formData.append('location_description', locationDescription);
    return apiClient.post('/diagnostics/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateStatus: (id, status) => apiClient.patch(`/diagnostics/${id}/`, { status }),
};
