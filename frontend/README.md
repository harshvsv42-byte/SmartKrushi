# SmartKrushi Frontend — React Native & Expo Mobile Application

## 1. Overview & Purpose
The `frontend/` directory contains the complete cross-platform mobile application for the **SmartKrushi** agricultural platform. It is built using **React Native (0.86.3)** and **Expo (~57.0.26)** with **Expo Router (~57.0.24)** for file-based native routing.

The application delivers actionable agricultural insights to farmers directly on Android and iOS devices, with built-in support for:
- Live weather tracking and 7-day forecast advice.
- Soil health analysis, NPK nutrient levels, and fertilizer recommendations.
- Interactive crop catalog with regional suitability and pest diagnostics.
- AI-assisted plant disease diagnosis via camera image capture and gallery upload.
- Real-time APMC Mandi commodity market prices, government subsidy schemes, and crop calendars.
- Farmer profile management with localized settings.

---

## 2. Directory Structure

```
frontend/
├── assets/                       # Visual assets, icons, splash screens, favicon
│   ├── android-icon-foreground.png
│   ├── android-icon-background.png
│   ├── icon.png
│   └── splash-icon.png
├── plugins/                      # Custom Expo config plugins
│   └── withCleartextTraffic.js   # Enables cleartext HTTP traffic for local Django dev
├── src/                          # Application source code
│   ├── app/                      # Expo Router screens (routes & layouts)
│   │   ├── _layout.js            # Root Stack navigator
│   │   ├── +not-found.js         # 404 fallback screen
│   │   ├── (tabs)/               # Bottom tab bar navigator & screens
│   │   │   ├── _layout.js        # Tab bar configuration & icons
│   │   │   ├── index.js          # Main farmer dashboard screen
│   │   │   ├── crops.js          # Crop catalog & search screen
│   │   │   ├── diagnose.js       # AI plant disease diagnosis screen
│   │   │   ├── market.js         # Mandi prices & govt schemes screen
│   │   │   └── profile.js        # Farmer profile & settings screen
│   │   ├── weather.js            # Detailed 7-day weather forecast screen
│   │   ├── soil.js               # Comprehensive soil test & nutrient screen
│   │   └── crop/[id].js          # Individual crop detail view
│   ├── components/               # Reusable UI widgets
│   │   └── ui.js                 # Header, Card, Badge, Button, Input, Metric widgets
│   ├── constants/                # Design tokens & configuration
│   │   └── theme.js              # Colors, spacing, and typography
│   ├── lib/                      # Core network & utility libraries
│   │   └── api.js                # HTTP fetch client configured for Django REST API
│   └── services/                 # API service layer
│       └── api.js                # Service export interface
├── tests/                        # Verification and integration tests
│   └── verify_frontend.js        # Automated file structure & syntax validator
├── .env.example                  # Environment variable template
├── .gitignore                    # Frontend git exclusion list
├── app.json                      # Expo application manifest & configuration
├── eas.json                      # Expo Application Services (EAS) cloud build config
├── package.json                  # Authoritative npm dependencies and scripts
├── package-lock.json             # Exact dependency lockfile
└── requirements.txt              # Human-readable frontend setup & system requirements
```

---

## 3. Key Files & Responsibilities

| File | Purpose & Main Modules | Interactions |
| :--- | :--- | :--- |
| `src/app/_layout.js` | Root Expo Router layout. Configures native `Stack` screens with status bar and styling. | Wraps all routes and defines transitions. |
| `src/app/(tabs)/_layout.js` | Configures bottom tab navigator with Ionicons for Home, Crops, Diagnose, Market, and Profile. | Parent layout for bottom-tab screens. |
| `src/app/(tabs)/index.js` | **Main Farmer Dashboard**: Greets farmer, displays live weather overview, quick navigation actions, soil status, market ticker, and seasonal alerts. | Fetches from `/api/v1/weather/current/`, `/api/v1/alerts/`, and `/api/v1/market/prices/`. |
| `src/app/(tabs)/crops.js` | **Crop Catalog**: Filterable list of crops with search bar, season badges (Kharif, Rabi, Zaid), and soil compatibility. | Fetches from `/api/v1/crops/`. Navigates to `crop/[id].js`. |
| `src/app/(tabs)/diagnose.js` | **Plant Disease Diagnostics**: Uses `expo-image-picker` to take camera photos or select leaf images; uploads to backend and displays symptoms and treatments. | Calls `postForm('/api/v1/diagnostics/', ...)` to Django backend. |
| `src/app/(tabs)/market.js` | **Market & Schemes**: Displays APMC Mandi commodity rates, Government agricultural schemes (PM-KISAN, PMFBY), and crop calendar. | Fetches from `/api/v1/market/prices/`, `/api/v1/market/schemes/`, `/api/v1/market/calendar/`. |
| `src/app/(tabs)/profile.js` | **Farmer Profile**: Displays farm size, soil type, primary crop, district, and contact info. | Connects to `/api/v1/auth/profile/`. |
| `src/app/weather.js` | **Weather Details**: Detailed 7-day forecast, humidity, precipitation probability, wind speed, UV index, and advisory. | Fetches from `/api/v1/weather/details/`. |
| `src/app/soil.js` | **Soil Health & Nutrients**: Nitrogen (N), Phosphorus (P), Potassium (K) levels, pH status, and recommended organic fertilizers. | Fetches from `/api/v1/soil/by-coordinates/`. |
| `src/app/crop/[id].js` | **Crop Details**: Comprehensive agronomic guide including water needs, temperature range, and pest management. | Fetches from `/api/v1/crops/<id>/`. |
| `src/components/ui.js` | Reusable UI design system: `Header`, `Card`, `Badge`, `MetricCard`, `ActionButton`, `SectionTitle`. | Imported across all screens for consistent UI. |
| `src/lib/api.js` | **API Client Layer**: Dynamic `API_BASE_URL` resolution, error handling, JSON requests (`getJson`), and multipart uploads (`postForm`). | Central bridge between React Native and Django. |
| `plugins/withCleartextTraffic.js`| Expo Config Plugin to inject `android:usesCleartextTraffic="true"` into AndroidManifest.xml. | Enables Android devices to communicate with local HTTP backend servers. |

---

## 4. Entry Points & Workflow

1. **Native Entry Point**: `expo-router/entry` (defined in `package.json`).
2. **App Entry Route**: `src/app/_layout.js` initializes the navigation stack and mounts `src/app/(tabs)/index.js` as the default screen.
3. **API Resolution**: `src/lib/api.js` resolves the backend address in order:
   - `process.env.EXPO_PUBLIC_API_BASE_URL` (if set in `.env`)
   - `http://10.0.2.2:8000/api/v1` (on Android emulator)
   - `http://127.0.0.1:8000/api/v1` (on iOS / web)

---

## 5. How to Run, Test, and Build

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
- For **Android Emulator**: `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api/v1`
- For **Physical Phone**: `EXPO_PUBLIC_API_BASE_URL=http://<YOUR_WIFI_IP>:8000/api/v1`

### Step 3: Start Development Server
```bash
npx expo start --clear
```
- Press `a` to open in Android Emulator.
- Press `w` to open in Web Browser.
- Scan the terminal QR code using Expo Go on your mobile phone.

### Step 4: Run Verification Tests
```bash
node tests/verify_frontend.js
```

### Step 5: Build Installable Android APK (EAS)
```bash
npm run build:apk
```

---

## 6. How to Add New Screens or Features

1. **Adding a Screen**: Create a new `.js` file inside `src/app/` (e.g., `src/app/irrigation.js`). Expo Router will automatically map it to the `/irrigation` route.
2. **Adding a Tab**: Open `src/app/(tabs)/_layout.js` and add a `<Tabs.Screen name="irrigation" ... />` definition with an Ionicons icon.
3. **Adding a Reusable UI Component**: Place the component in `src/components/ui.js` and export it.
4. **Adding API Endpoints**: Add helper methods in `src/services/api.js` utilizing `getJson(path, params)` or `postForm(path, fields)`.
