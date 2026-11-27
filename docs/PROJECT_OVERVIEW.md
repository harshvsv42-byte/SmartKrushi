# SmartKrushi — Project Overview

## 1. Executive Summary
**SmartKrushi** is an integrated, end-to-end smart agricultural intelligence platform designed to empower farmers, agronomists, and agricultural extension workers with real-time data, predictive insights, and automated decision support.

The system combines:
1. **Cross-Platform Mobile Application**: Built with React Native and Expo Router for mobile devices.
2. **Robust Django REST Framework Backend**: Powered by Python 3.12, providing modular micro-services for soil, weather, crops, markets, and diagnostics.
3. **Automated Agricultural Intelligence**:
   - Live weather monitoring & 7-day agricultural forecasts via the OpenWeather Site API and Open-Meteo fallback.
   - Soil fertility scoring and personalized NPK nutrient balance calculators.
   - AI plant disease diagnostics from camera photo uploads.
   - Live APMC Mandi commodity rates and government welfare scheme trackers (PM-KISAN, PMFBY).
   - Multi-language readiness (English, Gujarati, Hindi).

---

## 2. Core Pillars & Capabilities

### Pillar 1: Live Agricultural Telemetry & Weather
- Integrates with the **OpenWeather Site API** (`https://api.openweathermap.org/data/2.5`) to retrieve real-time temperature, humidity, wind velocity, precipitation probability, and atmospheric pressure based on GPS coordinates.
- Employs a resilient fallback mechanism to **Open-Meteo** and database caching, guaranteeing uninterrupted weather telemetry even without third-party API keys or during network outages.

### Pillar 2: Agronomic Soil Analysis
- Analyzes soil composition: Nitrogen (N), Phosphorus (P), Potassium (K), and pH levels.
- Recommends tailored organic and chemical fertilizer interventions based on target crop requirements and soil deficiency patterns.

### Pillar 3: AI Crop Disease Diagnostics
- Farmers can capture leaf symptoms in the field using their smartphone camera or gallery.
- Images are submitted to the backend via `FormData`, mapped against disease taxonomy records, and analyzed to provide instant symptoms, organic remedies, and chemical treatment guidelines.

### Pillar 4: APMC Mandi Market Intelligence & Government Subsidies
- Live tracking of agricultural commodity market prices across regional APMC mandis.
- Catalogs active agricultural schemes and subsidies (e.g. PM-KISAN, PM Krishi Sinchayee Yojana, Crop Insurance PMFBY) with eligibility criteria and application links.

### Pillar 5: Comprehensive Crop Catalog & Calendar
- Rich agronomic catalog providing water requirements, optimal sowing seasons (Kharif, Rabi, Zaid), temperature tolerance, and pest resistance for major crops (Wheat, Cotton, Rice, Groundnut, Maize, Mustard, Potato).

---

## 3. Technology Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Mobile Frontend** | React Native 0.86.3, Expo SDK ~57.0.26, Expo Router ~57.0.24, React 19.2.3, @expo/vector-icons, expo-location, expo-image-picker |
| **Backend API** | Python 3.12, Django 6.1.1, Django REST Framework 3.18.1, SimpleJWT 5.5.1, django-cors-headers, drf-spectacular (OpenAPI 3.0 / Swagger UI) |
| **Data Science & ML** | NumPy 2.5, SciPy 1.18, Pandas 3.0, Scikit-learn 1.9, Joblib, Pillow 12.3 |
| **Databases** | SQLite 3 (pre-seeded default for development & testing), MySQL support |
| **Cloud & Packaging** | Expo Application Services (EAS Build) for Android `.apk` generation |
| **Companion Web App** | React 19, Vite 8, Tailwind CSS 3.4, i18next (English, Gujarati, Hindi) |
