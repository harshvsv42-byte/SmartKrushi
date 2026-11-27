# SmartKrushi — Database Architecture & Schema

## 1. Database Overview
SmartKrushi uses **SQLite 3** as its default development database (`backend/db.sqlite3`), with pre-configured support for **MySQL** in production environments.

The database comes pre-seeded with real agricultural reference records:
- **Crops Catalog**: 7 major agricultural crops with multilingual taxonomy.
- **Weather Records**: 19 historical and forecasted weather observations.
- **Agricultural Profiles**: Farmer profile schemas and telemetry.

---

## 2. Core Entity Schemas

### 2.1 `accounts.FarmerProfile`
Extends Django's `auth.User` model with farmer-specific metadata.
- `user`: OneToOneField -> `auth.User`
- `phone_number`: CharField(max_length=15, unique=True)
- `state`: ForeignKey -> `locations.State`
- `district`: ForeignKey -> `locations.District`
- `taluka`: ForeignKey -> `locations.Taluka`
- `farm_size_acres`: DecimalField(max_digits=6, decimal_places=2)
- `preferred_language`: CharField(choices=['en', 'gu', 'hi'], default='en')
- `primary_crop`: ForeignKey -> `crops.Crop`, null=True

### 2.2 `crops.Crop` & `crops.CropRecord`
- `name`: CharField (English)
- `name_gu`: CharField (Gujarati)
- `name_hi`: CharField (Hindi)
- `scientific_name`: CharField
- `season`: CharField(choices=['Kharif', 'Rabi', 'Zaid', 'All Season'])
- `water_requirement`: CharField(choices=['Low', 'Medium', 'High'])
- `ideal_soil_type`: CharField
- `temperature_min`: FloatField
- `temperature_max`: FloatField
- `duration_days`: IntegerField

### 2.3 `weather.WeatherRecord`
- `latitude`: FloatField
- `longitude`: FloatField
- `district`: ForeignKey -> `locations.District`, null=True
- `temperature`: FloatField
- `humidity`: FloatField
- `wind_speed`: FloatField
- `pressure`: FloatField
- `rainfall`: FloatField
- `condition`: CharField
- `recorded_at`: DateTimeField(auto_now_add=True)

### 2.4 `soil.SoilRecord`
- `farmer`: ForeignKey -> `accounts.FarmerProfile`
- `nitrogen_level`: FloatField (mg/kg)
- `phosphorus_level`: FloatField (mg/kg)
- `potassium_level`: FloatField (mg/kg)
- `ph_level`: FloatField
- `moisture_percent`: FloatField
- `tested_at`: DateTimeField(auto_now_add=True)

---

## 3. Database Migrations

All models use Django's built-in migration framework. Migrations are stored inside each app's `migrations/` folder.

To view migration history:
```powershell
python manage.py showmigrations
```

To create a new migration after modifying models:
```powershell
python manage.py makemigrations <app_name>
```

To apply migrations:
```powershell
python manage.py migrate
```

---

## 4. Production MySQL Configuration

To switch from SQLite to MySQL:
1. Ensure `mysqlclient==2.3.0` is installed.
2. In `backend/.env`, set:
   ```ini
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=smartkrushi_db
   DB_USER=smartkrushi_user
   DB_PASSWORD=your_strong_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```
3. Run `python manage.py migrate` to create all tables in MySQL.
