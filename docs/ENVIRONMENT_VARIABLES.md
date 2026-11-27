# SmartKrushi — Environment Variables Reference

This document lists all environment variables used across the **SmartKrushi** Django backend and Expo React Native mobile frontend.

---

## 1. Backend Environment Variables (`backend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `DEBUG` | Boolean | `True` | Enables Django debug mode and verbose traceback outputs. Must be `False` in production. |
| `SECRET_KEY` | String | *Pre-configured dev key* | Cryptographic salt used for signing sessions and JWT tokens. Must be kept secret in production. |
| `ALLOWED_HOSTS` | Comma-delimited | `localhost,127.0.0.1,0.0.0.0,testserver,*` | Hostnames/IPs permitted to serve the application. `0.0.0.0` allows physical phones on LAN to reach Django. |
| `CORS_ALLOW_ALL_ORIGINS`| Boolean | `True` | Allows any client origin (mobile emulators, web apps) to make cross-origin HTTP requests. |
| `OPENWEATHER_API_KEY` | String | `""` (empty) | API key for OpenWeather Site API (`https://api.openweathermap.org`). If omitted, system falls back to Open-Meteo. |
| `OPENWEATHER_BASE_URL` | URL | `https://api.openweathermap.org/data/2.5` | Base endpoint for OpenWeather requests. |
| `OPEN_METEO_BASE_URL` | URL | `https://api.open-meteo.com/v1/forecast` | Fallback public endpoint for weather data. |

### Optional MySQL Database Configuration
| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `DB_ENGINE` | String | `django.db.backends.sqlite3` | Database engine (`django.db.backends.mysql`). |
| `DB_NAME` | String | `db.sqlite3` | Database schema name. |
| `DB_USER` | String | `""` | Database username for MySQL. |
| `DB_PASSWORD` | String | `""` | Database password for MySQL. |
| `DB_HOST` | String | `127.0.0.1` | Database server host. |
| `DB_PORT` | Integer | `3306` | Database port. |

---

## 2. Frontend Environment Variables (`frontend/.env`)

All React Native / Expo environment variables intended for the client bundle must begin with the `EXPO_PUBLIC_` prefix.

| Variable | Target | Recommended Value | Description |
| :--- | :--- | :--- | :--- |
| `EXPO_PUBLIC_API_BASE_URL` | Android Emulator | `http://10.0.2.2:8000/api/v1` | `10.0.2.2` bridges directly to the host machine's `127.0.0.1`. |
| `EXPO_PUBLIC_API_BASE_URL` | Physical Phone (LAN) | `http://<YOUR_WIFI_IP>:8000/api/v1` | Computer's local IPv4 address (e.g. `192.168.1.15`). |
| `EXPO_PUBLIC_API_BASE_URL` | Web Browser | `http://127.0.0.1:8000/api/v1` | Local loopback address for web browser testing. |
| `EXPO_PUBLIC_API_BASE_URL` | Production APK | `https://api.yourdomain.com/api/v1` | Production HTTPS API endpoint. |

---

## 3. Best Practices & Security Rules

1. **Never commit `.env` files**: `.env` files are ignored in `.gitignore`.
2. **Always update `.env.example`**: When adding a new variable to code, document it in `.env.example` with a safe dummy value.
3. **No hardcoded secrets**: Never commit private API keys or database passwords to source code.
