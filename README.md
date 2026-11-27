# SmartKrushi — AI-Powered Smart Agriculture Assistant Platform

![SmartKrushi Platform](https://img.shields.io/badge/Platform-SmartKrushi-0B5D34?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-57.0.26-000020?style=for-the-badge&logo=expo)
![Python Django](https://img.shields.io/badge/Django-6.1.1-092E20?style=for-the-badge&logo=django)
![REST Framework](https://img.shields.io/badge/DRF-3.18.1-red?style=for-the-badge)

**SmartKrushi** is a complete, production-grade agricultural intelligence platform connecting farmers with real-time agronomic telemetry. It features live weather tracking via the OpenWeather Site API, soil NPK nutrient analysis, camera-based AI plant disease diagnostics, regional APMC Mandi commodity rates, and government agricultural welfare schemes.

The entire system is managed and orchestrated from this single root directory (`smartkrushi/`).

---

## 1. Architecture & Unified Directory Layout

```
smartkrushi/
├── README.md                     # This root setup and execution guide
├── .gitignore                    # Master exclusion list (Python, Node, Expo, secrets)
├── .env.example                  # Unified environment variable template
├── package.json                  # Workspace script orchestrator (npm run dev/setup)
├── app.json                      # Root Expo application manifest
├── eas.json                      # Expo Application Services (EAS) cloud build config
│
├── frontend/                     # React Native & Expo Mobile Application
│   ├── README.md                 # Frontend component & screen documentation
│   ├── requirements.txt          # Human-readable frontend setup & system requirements
│   ├── package.json              # Authoritative frontend npm dependencies
│   ├── app.json                  # Expo mobile manifest & native permissions
│   ├── eas.json                  # EAS preview APK build profiles
│   ├── src/                      # Mobile application source
│   │   ├── app/                  # Expo Router file-based screens ((tabs), weather, soil)
│   │   ├── components/           # Reusable UI widgets (Header, Card, Metric, Badge)
│   │   ├── constants/            # Design tokens & color palettes
│   │   ├── lib/                  # Network client for Django REST API
│   │   └── services/             # Service abstraction layer
│   ├── assets/                   # App icons, splash screens, favicon
│   ├── plugins/                  # Cleartext HTTP traffic plugin for local Django dev
│   └── tests/                    # Frontend verification test suite
│
├── backend/                      # Python Django REST Framework Backend
│   ├── README.md                 # Backend app & architecture documentation
│   ├── requirements.txt          # Authoritative pinned Python dependencies
│   ├── manage.py                 # Django CLI management script
│   ├── config/                   # Django settings, central URLs, and WSGI/ASGI
│   ├── accounts/                 # User authentication & farmer profiles
│   ├── crops/                    # Crop taxonomy and multilingual catalog
│   ├── weather/                  # OpenWeather Site API + Open-Meteo fallback
│   ├── soil/                     # Soil testing & NPK nutrient recommendations
│   ├── plant_health/             # Disease & pest taxonomy and treatments
│   ├── dashboard/                # APMC Mandi prices, govt subsidies, alerts
│   ├── fertilizers/              # Fertilizer dosing and suitability
│   ├── recommendations/          # Rule-based agronomic advisory engine
│   ├── locations/                # State, District, Taluka mapping
│   ├── datasets/                 # Bulk data ingestion tools
│   ├── db.sqlite3                # Pre-seeded SQLite database with real records
│   ├── media/                    # Storage for uploaded leaf diagnostic photos
│   └── tests/                    # Backend REST API integration test suite
│
├── docs/                         # Comprehensive Technical Documentation
│   ├── README.md                 # Documentation index
│   ├── PROJECT_OVERVIEW.md       # Full platform mission and capabilities
│   ├── ARCHITECTURE.md           # Multi-tier system design and data flow
│   ├── FOLDER_STRUCTURE.md       # Complete directory tree and file map
│   ├── FRONTEND_SETUP.md         # React Native, Expo, and Android guide
│   ├── BACKEND_SETUP.md          # Python virtualenv and Django setup guide
│   ├── API_DOCUMENTATION.md      # REST endpoints and request/response schemas
│   ├── DATABASE.md               # Model schemas, migrations, and seed data
│   ├── ENVIRONMENT_VARIABLES.md  # Detailed reference of all environment variables
│   ├── TROUBLESHOOTING.md        # Solutions for network, Expo, and Django errors
│   └── DEVELOPMENT_GUIDE.md      # Developer workflows and testing best practices
│
├── scripts/                      # Windows PowerShell Automation Scripts
│   ├── setup.ps1                 # Automated prerequisite check & environment setup
│   ├── run-backend.ps1           # Starts Django REST API backend on port 8000
│   ├── run-frontend.ps1          # Starts Expo mobile frontend (Metro bundler)
│   ├── run-all.ps1               # Concurrently starts backend & frontend in separate terminals
│   └── build-apk.ps1             # Compiles installable Android APK with EAS
│
├── web/                          # Companion React 19 + Vite Web Application
└── tests/                        # Full-stack automated verification suite
```

---

## 2. Prerequisites

Before starting, ensure the following are installed on your Windows system:
- **Python**: Version 3.10+ (Verified with Python 3.12.4).
- **Node.js**: LTS version 20+ or 22+ (Verified with Node v22.12.0).
- **npm**: Version 10+ (Verified with npm v10.9.0).
- **Expo Go App**: Install on your Android phone from the Google Play Store (for physical device testing).

---

## 3. Quick Start — Automated Setup (One Command)

From the `smartkrushi/` root directory, open Windows PowerShell and run:

```powershell
.\scripts\setup.ps1
```

This automated script performs:
1. Prerequisites validation (Python, Node.js, npm).
2. Environment file creation (`backend/.env` and `frontend/.env` safely initialized from templates without overwriting existing files).
3. Backend Python virtual environment creation (`backend/venv`).
4. Pinned dependency installation from `backend/requirements.txt`.
5. Django database and system checks (`python manage.py check`).
6. Frontend npm dependency installation (`npm install`).

---

## 4. Running the Platform

### Option A: Launch Both Servers Together (Recommended)
From `smartkrushi/`, run:
```powershell
.\scripts\run-all.ps1
```
*(Or run `npm run dev` from the project root)*

This opens two dedicated, labeled PowerShell windows:
- **Terminal 1**: Django REST Backend running on `http://0.0.0.0:8000/`.
- **Terminal 2**: React Native Expo Metro Bundler ready for Android/Web.

---

### Option B: Run in Separate Terminals

#### Terminal 1 — Start Django REST Backend:
```powershell
cd smartkrushi
.\scripts\run-backend.ps1
```
- **Backend API**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- **Interactive Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

#### Terminal 2 — Start Expo Mobile Frontend:
```powershell
cd smartkrushi
.\scripts\run-frontend.ps1
```
Interactive terminal shortcuts in the Metro bundler:
- Press `a` : Launch on Android emulator.
- Press `w` : Open in Web browser.
- Press `r` : Reload active app.
- **Scan the QR Code**: Using the **Expo Go** app on your Android phone.

---

## 5. Running on a Physical Android Phone

1. Connect your Android phone to the **same Wi-Fi network** as your computer.
2. In PowerShell, find your computer's local IPv4 address by running `ipconfig` (e.g. `192.168.1.15`).
3. Open `frontend/.env` and set:
   ```ini
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.15:8000/api/v1
   ```
4. Start the backend: `.\scripts\run-backend.ps1` (it listens on `0.0.0.0:8000` to accept LAN connections).
5. Start the frontend: `.\scripts\run-frontend.ps1`.
6. Open **Expo Go** on your Android phone and scan the QR code displayed in the terminal.

---

## 6. Building an Installable Android APK

The project is pre-configured with `eas.json` to generate an installable standalone Android `.apk` (no Android Studio or Google Play Console required):

1. Log into your Expo account:
   ```powershell
   npx eas-cli login
   ```
2. Trigger the cloud APK build:
   ```powershell
   .\scripts\build-apk.ps1
   ```
   *(Or run `npm run build:apk` from `smartkrushi/frontend`)*
3. When the build completes, download the `.apk` from the printed URL and install it directly on any Android device.

---

## 7. Running Verification Tests

Run the full-stack repository verification suite:
```powershell
node tests/verify_project.js
```

Run backend Django automated tests (36 integration and app tests):
```powershell
.\scripts\run-backend.ps1 -TestOnly
```

Run frontend syntax and route integrity check:
```powershell
node frontend/tests/verify_frontend.js
```

---

## 8. Documentation Sitemap

For in-depth guides, explore the dedicated documentation in [`docs/`](file:///e:/j/project/project/smartkrushi/docs/):
- **[Architecture & Data Flow](file:///e:/j/project/project/smartkrushi/docs/ARCHITECTURE.md)**
- **[Folder Structure Breakdown](file:///e:/j/project/project/smartkrushi/docs/FOLDER_STRUCTURE.md)**
- **[Frontend & EAS Guide](file:///e:/j/project/project/smartkrushi/docs/FRONTEND_SETUP.md)**
- **[Backend & Django Guide](file:///e:/j/project/project/smartkrushi/docs/BACKEND_SETUP.md)**
- **[REST API Specification](file:///e:/j/project/project/smartkrushi/docs/API_DOCUMENTATION.md)**
- **[Database & Models](file:///e:/j/project/project/smartkrushi/docs/DATABASE.md)**
- **[Environment Variables](file:///e:/j/project/project/smartkrushi/docs/ENVIRONMENT_VARIABLES.md)**
- **[Troubleshooting & FAQ](file:///e:/j/project/project/smartkrushi/docs/TROUBLESHOOTING.md)**
- **[Developer Contribution Guide](file:///e:/j/project/project/smartkrushi/docs/DEVELOPMENT_GUIDE.md)**
