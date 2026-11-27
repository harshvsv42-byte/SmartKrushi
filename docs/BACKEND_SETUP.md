# SmartKrushi — Backend Setup & Operation Guide

This guide details setting up, configuring, running, and testing the **SmartKrushi** Django REST Framework backend on Windows PowerShell.

---

## 1. System Requirements

- **Python**: Python 3.10+ (Verified and tested with Python 3.12.4).
- **pip**: Version 24.x+.
- **Database**: SQLite 3 (built-in default; pre-seeded in `backend/db.sqlite3`).

---

## 2. Virtual Environment Setup

From the `smartkrushi/backend` directory:

```powershell
# Create a fresh Python virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1
```

*(Note: If PowerShell prompts an ExecutionPolicy error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

---

## 3. Install Dependencies

Install all pinned packages from `requirements.txt`:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 4. Environment Configuration (`.env`)

Copy `.env.example` to create `.env`:

```powershell
copy .env.example .env
```

Review the core parameters:
- `DEBUG=True` (Safe for local development)
- `SECRET_KEY`: Set your private key in production.
- `ALLOWED_HOSTS`: Set to `localhost,127.0.0.1,0.0.0.0,testserver,*` to permit LAN phone access.
- `CORS_ALLOW_ALL_ORIGINS=True`: Required for mobile client HTTP communication.
- `OPENWEATHER_API_KEY`: *(Optional)* Add your free key from openweathermap.org. If left empty, the system automatically falls back to Open-Meteo.

---

## 5. Database Verification & Migrations

The repository includes a pre-seeded `db.sqlite3` with 7 agricultural crops, 19 weather history records, and schema tables.

Verify migration status:
```powershell
python manage.py showmigrations
```
All core apps (`accounts`, `crops`, `weather`, `soil`, `plant_health`, `dashboard`, `fertilizers`, `locations`, `datasets`) will display `[X]` indicating applied status.

To apply any newly added migrations:
```powershell
python manage.py migrate
```

---

## 6. Running the Server

### Using the Automation Script (Recommended)
From the project root:
```powershell
.\scripts\run-backend.ps1
```

### Manual Command
From `smartkrushi/backend`:
```powershell
python manage.py runserver 0.0.0.0:8000
```
> **Important:** Binding to `0.0.0.0` ensures the server listens on all network interfaces, allowing physical mobile phones on your local Wi-Fi network to reach the API.

---

## 7. Interactive API Documentation & Verification

Once the server is running:
1. **Swagger UI**: Open [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) in your browser to interactively test every endpoint.
2. **ReDoc**: Open [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/).
3. **API Info Endpoint**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/) returns JSON metadata.

---

## 8. Running Automated Tests

Run the backend integration test suite:
```powershell
python manage.py test tests
```

Run all Django application unit tests:
```powershell
python manage.py test weather crops accounts soil plant_health dashboard locations
```
Expected output:
```
Ran 36 tests in 39.290s
OK
```
