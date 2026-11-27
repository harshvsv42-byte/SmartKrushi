# SmartKrushi — Frontend Setup & Deployment Guide

This guide walks you through setting up, running, and compiling the **SmartKrushi** React Native mobile application powered by Expo.

---

## 1. System Requirements

- **Node.js**: LTS version 20.x or 22.x (Verified with Node v22.12.0)
- **npm**: Version 10.x+ (Verified with npm v10.9.0)
- **Expo Go App**: Required for testing on physical devices (download from Google Play Store or Apple App Store).
- **Android Studio** *(Optional)*: Required only if testing on local Android Virtual Devices (AVD).

---

## 2. Installation

From the project root or the `frontend` folder:

```powershell
cd smartkrushi\frontend
npm install
```

---

## 3. Environment Configuration (`.env`)

Copy `.env.example` to create `.env`:

```powershell
copy .env.example .env
```

Set the backend API URL according to your testing target:

### Scenario A: Testing in an Android Emulator
Android emulators run in an isolated virtual network. The host computer's `localhost` is accessible via the special loopback IP `10.0.2.2`:
```ini
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api/v1
```

### Scenario B: Testing on a Physical Android Phone (Expo Go or APK)
Your phone and computer must be connected to the **same local Wi-Fi network**.
1. Open PowerShell and run `ipconfig`.
2. Locate your **IPv4 Address** under your Wi-Fi adapter (e.g., `192.168.1.15`).
3. Set in `.env`:
   ```ini
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.15:8000/api/v1
   ```
4. Ensure your computer's firewall allows inbound connections on port `8000`.

### Scenario C: Testing in Web Browser
```ini
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 4. Running the Development Server

From the project root:
```powershell
.\scripts\run-frontend.ps1
```
Or directly from `frontend/`:
```powershell
npx expo start --clear
```

### Metro Bundler Terminal Shortcuts
- Press `a` : Launch on Android emulator or connected USB device.
- Press `w` : Open in web browser.
- Press `r` : Reload the active app.
- Press `m` : Toggle the in-app developer menu.
- **Scan QR Code**: Open the **Expo Go** app on Android and scan the terminal QR code.

---

## 5. Building an Installable Android APK (Cloud EAS Build)

The project includes pre-configured `eas.json` profiles for compiling an installable standalone Android `.apk` file without requiring local Android SDK or Gradle installations.

### Step 1: Install EAS CLI
```powershell
npm install -g eas-cli
```
*(Or invoke dynamically via `npx eas-cli@latest`)*

### Step 2: Log into Expo EAS
```powershell
npx eas-cli login
```

### Step 3: Trigger the Build
From the project root:
```powershell
.\scripts\build-apk.ps1
```
Or from `frontend/`:
```powershell
npm run build:apk
```

### Step 4: Download & Install
When the cloud build finishes, EAS prints a direct download link. Download the `.apk` file to your Android phone, enable *Install Unknown Apps* in settings, and tap to install.

---

## 6. Frontend Verification Checks

Validate syntax and route integrity across all frontend files:
```powershell
node frontend\tests\verify_frontend.js
```
Expected output:
```
🎉 All critical frontend files verified successfully!
```
