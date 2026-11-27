# SmartKrushi — Troubleshooting & FAQ Guide

This guide covers common issues and resolutions when running, developing, or packaging the **SmartKrushi** platform.

---

## 1. Network & API Connection Issues

### Issue: Mobile app says "Cannot reach the API at http://10.0.2.2:8000/api/v1"
- **Cause 1**: The Django backend is not running.
  - **Fix**: Run `.\scripts\run-backend.ps1` or `python manage.py runserver 0.0.0.0:8000`.
- **Cause 2**: You are testing on a **physical phone**, but `.env` still has `10.0.2.2`.
  - **Fix**: `10.0.2.2` works only in the Android Emulator. For a physical phone, run `ipconfig` on your computer, find your Wi-Fi IPv4 address (e.g. `192.168.1.15`), and update `frontend/.env`:
    ```ini
    EXPO_PUBLIC_API_BASE_URL=http://192.168.1.15:8000/api/v1
    ```
- **Cause 3**: Windows Firewall is blocking inbound connections on port 8000.
  - **Fix**: Open Windows Firewall settings and permit inbound TCP traffic on port 8000 for private networks.

### Issue: Android blocks cleartext HTTP requests ("Cleartext HTTP traffic not permitted")
- **Cause**: Android 9+ disables cleartext HTTP by default.
- **Fix**: The project includes the custom Expo Config Plugin `frontend/plugins/withCleartextTraffic.js` registered in `app.json`. This injects `android:usesCleartextTraffic="true"` into the generated Android manifest.

---

## 2. Frontend / Expo Issues

### Issue: Expo displays "Stale bundle" or Metro Bundler does not update changes
- **Fix**: Clear the Metro bundler cache:
  ```powershell
  cd smartkrushi\frontend
  npx expo start --clear
  ```

### Issue: `npm run build:apk` fails with EAS authentication error
- **Cause**: You are not signed into Expo Application Services.
- **Fix**: Run `npx eas-cli login` in your terminal and follow the interactive login prompt.

### Issue: Port 8081 is already in use
- **Cause**: An existing Metro bundler or Node process is occupying port 8081.
- **Fix**: Check active connections:
  ```powershell
  Get-NetTCPConnection -LocalPort 8081
  ```
  Terminate the lingering node process using `Stop-Process -Id <PID>`.

---

## 3. Backend / Django Issues

### Issue: `python manage.py runserver` fails with "Port 8000 is already in use"
- **Cause**: Another Django or development server instance is still running.
- **Fix**:
  ```powershell
  Get-NetTCPConnection -LocalPort 8000
  Stop-Process -Id <OwningProcessPID>
  ```
  Alternatively, run Django on a different port:
  ```powershell
  .\scripts\run-backend.ps1 -Port 8001
  ```

### Issue: Database file is locked ("sqlite3.OperationalError: database is locked")
- **Cause**: Multiple write operations colliding or an open database inspection tool holding an exclusive write lock on `db.sqlite3`.
- **Fix**: Close any open SQLite viewers (e.g. DB Browser for SQLite) and restart the server.

### Issue: Missing Python module error (`ModuleNotFoundError: No module named 'rest_framework'`)
- **Cause**: Your terminal has not activated the virtual environment where dependencies are installed.
- **Fix**: Activate the virtualenv:
  ```powershell
  .\backend\venv\Scripts\Activate.ps1
  ```
