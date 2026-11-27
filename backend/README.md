# SmartKrushi Backend — Django REST Framework Platform

## 1. Overview & Purpose
The `backend/` directory contains the complete server-side intelligence engine and REST API for the **SmartKrushi** agricultural platform. It is built using **Python 3.12**, **Django (6.1.1)**, and **Django REST Framework (3.18.1)**.

It provides authenticated, localized, and real-time APIs for:
- Farmer accounts & profile telemetry (`accounts`).
- Geographic mapping across states, districts, talukas, and villages (`locations`).
- Soil analysis, NPK nutrient scoring, and organic fertilizer calculation (`soil`).
- Comprehensive crop taxonomy and regional suitability (`crops`).
- Live weather tracking via OpenWeather Site API with Open-Meteo fallback (`weather`).
- Plant disease identification and pest management (`plant_health`).
- APMC Mandi commodity rates, government subsidy schemes, and briefings (`dashboard`).
- Agronomic recommendation engine and fertilizer advisory (`recommendations`, `fertilizers`).

---

## 2. Directory Structure

```
backend/
├── config/                       # Main Django project configuration
│   ├── __init__.py
│   ├── settings.py               # Settings, CORS, Database, Auth, OpenWeather API config
│   ├── urls.py                   # Central API routing table (/api/v1/ and /api/docs/)
│   ├── wsgi.py                   # WSGI server entry point
│   └── asgi.py                   # ASGI asynchronous entry point
├── accounts/                     # Farmer authentication, JWT tokens, and profiles
│   ├── models.py                 # FarmerProfile model schema
│   ├── views.py                  # Register, Login, Profile views
│   └── urls.py                   # /api/v1/auth/
├── crops/                        # Crop catalog and seasonal suitability
│   ├── models.py                 # Crop & CropRecord schemas
│   ├── views.py                  # Crop list, categories, details API
│   └── urls.py                   # /api/v1/crops/
├── weather/                      # OpenWeather Site API & Open-Meteo integration
│   ├── models.py                 # WeatherRecord schema
│   ├── services.py               # WeatherService (OpenWeather + Open-Meteo)
│   ├── views.py                  # Current weather & 7-day forecast API
│   └── urls.py                   # /api/v1/weather/
├── soil/                         # Soil testing, NPK analysis, moisture tracking
│   ├── models.py                 # SoilRecord schema
│   ├── views.py                  # Soil analysis & recommendation API
│   └── urls.py                   # /api/v1/soil/
├── plant_health/                 # Plant disease symptoms, pests, and remedies
│   ├── models.py                 # PlantDisease & Pest models
│   ├── views.py                  # Disease & pest lookup API
│   └── urls.py                   # /api/v1/diseases/ & /api/v1/pests/
├── dashboard/                    # Market prices, government schemes, and alerts
│   ├── views.py                  # Dashboard metrics and summary
│   ├── market_views.py           # Mandi prices & subsidy schemes
│   ├── alerts_views.py           # Farmer urgent alerts & morning briefing
│   ├── diagnostics_views.py      # Plant disease leaf image upload & history
│   └── urls.py                   # /api/v1/dashboard/, /api/v1/market/, /api/v1/alerts/
├── fertilizers/                  # Fertilizer database and dosing recommendations
├── recommendations/              # Rule-based agronomic engine
├── locations/                    # State, District, Taluka mapping
├── datasets/                     # Bulk data import and CSV/Excel utilities
├── chatbot/                      # Conversational assistant endpoints
├── farms/                        # Farm plot mapping and boundaries
├── predictions/                  # Harvest and yield forecasting models
├── iot/                          # Agricultural IoT telemetry and sensors
├── media/                        # User uploads (crop diagnostic photos, avatars)
├── static/                       # Static files
├── tests/                        # Backend integration tests
│   ├── __init__.py
│   └── test_api_endpoints.py    # REST endpoint verification test suite
├── .env.example                  # Environment variable template
├── .gitignore                    # Backend git exclusion list
├── db.sqlite3                    # Primary SQLite database with pre-seeded data
├── manage.py                     # Django CLI management script
└── requirements.txt              # Authoritative pinned Python dependencies
```

---

## 3. Key Files & Core Modules

| File / App | Purpose & Core Components | Interactions |
| :--- | :--- | :--- |
| `manage.py` | Django command-line runner (`runserver`, `migrate`, `test`, `createsuperuser`). | Root execution utility. |
| `config/settings.py` | Central configuration. Sets `DATABASES`, `INSTALLED_APPS`, `CORS_ALLOW_ALL_ORIGINS`, `SIMPLE_JWT`, and OpenWeather credentials. | Configures runtime environment for all Django apps. |
| `config/urls.py` | Master URL router. Maps `/api/v1/` to individual app URL configs and serves Swagger UI at `/api/docs/`. | Directs inbound HTTP requests to correct app controllers. |
| `weather/services.py` | `WeatherService`: Fetches live metrics from OpenWeather Site API (`https://api.openweathermap.org/data/2.5`) with resilient fallback to Open-Meteo. | Ingests external API data, normalizes response, caches in `WeatherRecord`. |
| `dashboard/market_views.py` | Provides real-time APMC Mandi commodity rates, Government subsidies (PM-KISAN, PMFBY), and seasonal crop calendar. | Serves `/api/v1/market/prices/`, `/api/v1/market/schemes/`, `/api/v1/market/calendar/`. |
| `dashboard/diagnostics_views.py`| Handles crop leaf image uploads via `FormData`, persists images in `media/`, and queries matching disease diagnoses. | Serves `/api/v1/diagnostics/` (GET / POST). |
| `crops/views.py` | `CropViewSet`: Serves localized crop information (English, Gujarati, Hindi). | Consumed by React Native `src/app/(tabs)/crops.js`. |
| `soil/views.py` | Computes soil fertility index and NPK nutrient ratios. | Consumed by React Native `src/app/soil.js`. |

---

## 4. API Endpoints Reference (`/api/v1/`)

| Endpoint | HTTP Method | Description |
| :--- | :--- | :--- |
| `/api/` | `GET` | API status and overview schema |
| `/api/docs/` | `GET` | Interactive Swagger UI API documentation |
| `/api/v1/weather/current/` | `GET` | Real-time weather for given coordinates/district |
| `/api/v1/weather/details/` | `GET` | Live weather condition + 7-day forecast array |
| `/api/v1/crops/` | `GET` | Catalog of agricultural crops with multi-language fields |
| `/api/v1/crops/<id>/` | `GET` | Detailed crop requirements, soil type, and pests |
| `/api/v1/soil/by-coordinates/` | `GET` | NPK nutrients, soil pH, moisture analysis |
| `/api/v1/market/prices/` | `GET` | Real-time APMC Mandi commodity prices & trends |
| `/api/v1/market/schemes/` | `GET` | Government agricultural subsidies & PM-KISAN schemes |
| `/api/v1/market/calendar/` | `GET` | Seasonal sowing calendar and crop guidance |
| `/api/v1/alerts/` | `GET` | System alerts (Irrigation, Pest, Frost warnings) |
| `/api/v1/alerts/briefing/` | `GET` | Morning farmer briefing feed |
| `/api/v1/diagnostics/` | `GET, POST` | Plant health diagnostic records and leaf image submissions |
| `/api/v1/auth/` | `POST` | User registration and token refresh |

---

## 5. How to Configure, Run, and Test

### Step 1: Create and Activate Virtual Environment
```powershell

.\venv\Scripts\Activate.ps1
```

### Step 2: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
Optionally configure `OPENWEATHER_API_KEY` if you have one.

### Step 4: Verify Database & Migrations
```powershell
python manage.py showmigrations
python manage.py migrate
```

### Step 5: Run the Server
```powershell
python manage.py runserver 0.0.0.0:8000
```
*(Listening on `0.0.0.0` allows physical Android devices on the same Wi-Fi network to connect).*

### Step 6: Run Backend Automated Tests
```powershell
# Run the integration endpoint test suite:
python manage.py test tests

# Run all app unit tests:
python manage.py test weather crops accounts soil plant_health dashboard locations
```

---

## 6. How to Add New Apps or Features

1. **Create an App**: Run `python manage.py startapp <app_name>`.
2. **Register in Settings**: Add `'<app_name>'` to `INSTALLED_APPS` in `config/settings.py`.
3. **Define Models**: Create model classes in `<app_name>/models.py`.
4. **Create Migrations**: Run `python manage.py makemigrations <app_name>` then `python manage.py migrate`.
5. **Create Serializers & Views**: Use Django REST Framework `serializers.ModelSerializer` and `viewsets.ModelViewSet`.
6. **Register URLs**: Create `<app_name>/urls.py` and register the route in `config/urls.py` under `/api/v1/<app_name>/`.
