# SmartKrushi Companion Web Frontend — React 19 + Vite

## 1. Overview & Purpose
The `web/` directory houses the companion responsive web frontend for the **SmartKrushi** agricultural platform. It is built using **React 19**, **Vite**, **Tailwind CSS**, and **i18next** (supporting English, Gujarati, and Hindi).

While the primary mobile client lives in `../frontend/` (React Native Expo), this web application provides desktop and tablet browser access to the agricultural intelligence dashboard, real-time APMC Mandi prices, soil health charts, and weather analytics.

---

## 2. Directory Structure

```
web/
├── public/                       # Static public assets
├── src/                          # React source files
│   ├── api/                      # Centralized API service layer (client.js, services.js)
│   ├── components/               # Dashboard, Market, Soil, Diagnostics widgets
│   ├── context/                  # Global React contexts (Auth, App state)
│   ├── locales/                  # Multi-language translation bundles (EN, GU, HI)
│   ├── pages/                    # Main route pages (HomePage, DiagnosticsPage, etc.)
│   ├── routes/                   # React Router routing configuration
│   ├── App.jsx                   # Root application component
│   ├── i18n.js                   # i18next configuration
│   └── main.jsx                  # React DOM client entry point
├── package.json                  # Web dependencies and build scripts
└── vite.config.js                # Vite bundler configuration
```

---

## 3. How to Run

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit the local server URL displayed in your terminal (typically `http://localhost:5173`).
