# SmartKrushi — Folder Structure & File Map

## 1. Top-Level Project Layout

```
smartkrushi/
├── README.md                     # Root project overview and quick-start guide
├── .gitignore                    # Master exclusion rules for Python, Node, Expo, and secrets
├── .env.example                  # Consolidated environment variable reference
├── package.json                  # Root workspace script orchestrator
├── app.json                      # Root Expo application manifest
├── eas.json                      # Root Expo Application Services build configuration
│
├── frontend/                     # React Native (Expo) Mobile Application
│   ├── assets/                   # App icons, splash screens, favicon
│   ├── plugins/                  # Custom Expo config plugins (withCleartextTraffic)
│   ├── src/                      # Mobile application source code
│   │   ├── app/                  # Expo Router file-based screens and layouts
│   │   │   ├── (tabs)/           # Bottom tab bar routes
│   │   │   │   ├── _layout.js    # Bottom tab navigator configuration
│   │   │   │   ├── index.js      # Main Farmer Dashboard screen
│   │   │   │   ├── crops.js      # Filterable Crop Catalog screen
│   │   │   │   ├── diagnose.js   # AI Crop Disease Diagnostics screen
│   │   │   │   ├── market.js     # APMC Mandi Rates & Govt Schemes screen
│   │   │   │   └── profile.js    # Farmer Profile & Settings screen
│   │   │   ├── _layout.js        # Root Stack navigation layout
│   │   │   ├── +not-found.js     # 404 fallback route
│   │   │   ├── weather.js        # 7-day Weather Forecast & Advisory screen
│   │   │   ├── soil.js           # Soil Health, NPK analysis, & Fertilizer screen
│   │   │   └── crop/             # Dynamic crop detail screens
│   │   │       └── [id].js       # Individual crop detail view
│   │   ├── components/           # Reusable UI widgets
│   │   │   └── ui.js             # Card, Badge, Metric, Header, Button components
│   │   ├── constants/            # Theme tokens, colors, spacing
│   │   │   └── theme.js          # Color palette and layout constants
│   │   ├── lib/                  # Core network utilities
│   │   │   └── api.js            # Network-aware API client for Django
│   │   └── services/             # Service abstraction layer
│   │       └── api.js            # Re-exports API methods
│   ├── tests/                    # Frontend test suite
│   │   └── verify_frontend.js    # Syntax and route integrity validator
│   ├── .env.example              # Mobile environment variables
│   ├── app.json                  # Frontend Expo manifest
│   ├── eas.json                  # EAS cloud build settings
│   ├── package.json              # Frontend package manifest
│   ├── package-lock.json         # Pinned npm dependencies
│   ├── README.md                 # Frontend technical documentation
│   └── requirements.txt          # Human-readable frontend setup guide
│
├── backend/                      # Python Django REST Framework Backend
│   ├── config/                   # Central Django project package
│   │   ├── __init__.py
│   │   ├── settings.py           # Core settings, database, CORS, JWT
│   │   ├── urls.py               # Central URL router & Swagger UI mapping
│   │   ├── wsgi.py               # WSGI application entry point
│   │   └── asgi.py               # ASGI application entry point
│   ├── accounts/                 # User authentication & Farmer profile app
│   ├── crops/                    # Crop taxonomy, catalog, and records app
│   ├── weather/                  # OpenWeather API & weather records app
│   ├── soil/                     # Soil testing & nutrient recommendations app
│   ├── plant_health/             # Disease & pest taxonomy app
│   ├── dashboard/                # Mandi market prices, subsidies, alerts app
│   ├── fertilizers/              # Fertilizer calculations app
│   ├── recommendations/          # Rule-based agronomic advisory app
│   ├── locations/                # Geographic state/district/taluka hierarchy
│   ├── datasets/                 # Bulk data ingestion app
│   ├── chatbot/                  # Farmer conversational query app
│   ├── farms/                    # Farm property management app
│   ├── predictions/              # Agricultural yield forecasting app
│   ├── iot/                      # Agricultural telemetry app
│   ├── media/                    # Persistent storage for user uploads (leaf images)
│   ├── static/                   # Static CSS/JS assets
│   ├── tests/                    # Backend integration test suite
│   │   ├── __init__.py
│   │   └── test_api_endpoints.py # Endpoint verification tests
│   ├── .env                      # Local development environment configuration
│   ├── .env.example              # Backend environment template
│   ├── db.sqlite3                # Pre-seeded SQLite database
│   ├── manage.py                 # Django command-line runner
│   ├── README.md                 # Backend technical documentation
│   └── requirements.txt          # Pinned Python package dependencies
│
├── docs/                         # Comprehensive project documentation
│   ├── README.md                 # Documentation index
│   ├── PROJECT_OVERVIEW.md       # High-level mission and feature description
│   ├── ARCHITECTURE.md           # System design and component interactions
│   ├── FOLDER_STRUCTURE.md       # This file
│   ├── FRONTEND_SETUP.md         # Mobile setup and EAS build instructions
│   ├── BACKEND_SETUP.md          # Python virtualenv and Django setup guide
│   ├── API_DOCUMENTATION.md      # REST endpoints and payload schema
│   ├── DATABASE.md               # Model schemas, migrations, and seed data
│   ├── ENVIRONMENT_VARIABLES.md  # Reference for all environment variables
│   ├── TROUBLESHOOTING.md        # Debugging common mobile and server errors
│   └── DEVELOPMENT_GUIDE.md      # Coding conventions and development workflows
│
├── scripts/                      # PowerShell automation scripts
│   ├── setup.ps1                 # Full automated environment setup
│   ├── run-backend.ps1           # Starts Django REST API server
│   ├── run-frontend.ps1          # Starts Expo mobile development server
│   ├── run-all.ps1               # Launches both servers concurrently
│   └── build-apk.ps1             # Triggers EAS Android APK cloud build
│
├── web/                          # Companion React 19 + Vite Web Application
│   ├── src/                      # Web application source files
│   ├── package.json              # Web dependencies
│   ├── vite.config.js            # Vite configuration
│   └── README.md                 # Web documentation
│
└── tests/                        # Full-Stack Integration Verification
    └── verify_project.js         # Automated end-to-end repository validator
```
