# SmartKrushi — REST API Documentation

All API v1 endpoints are served with the base path `/api/v1/`. For backward compatibility, `/api/<endpoint>/` aliases are also supported.

Interactive API exploration is available at:
- **Swagger UI**: `http://127.0.0.1:8000/api/docs/`
- **ReDoc**: `http://127.0.0.1:8000/api/redoc/`
- **OpenAPI 3.0 Schema**: `http://127.0.0.1:8000/api/schema/`

---

## 1. System & Health

### `GET /api/`
Returns system status, active version, documentation URLs, and route endpoints.

**Sample Response (200 OK):**
```json
{
  "project": "Smart Agriculture Assistant API",
  "version": "1.0",
  "status": "running",
  "documentation": {
    "swagger_ui": "http://127.0.0.1:8000/api/docs/",
    "redoc": "http://127.0.0.1:8000/api/redoc/",
    "openapi_schema": "http://127.0.0.1:8000/api/schema/"
  },
  "endpoints": {
    "auth": "http://127.0.0.1:8000/api/v1/auth/",
    "weather": "http://127.0.0.1:8000/api/v1/weather/",
    "crops": "http://127.0.0.1:8000/api/v1/crops/",
    "soil": "http://127.0.0.1:8000/api/v1/soil/",
    "dashboard": "http://127.0.0.1:8000/api/v1/dashboard/"
  }
}
```

---

## 2. Weather Intelligence (`/api/v1/weather/`)

### `GET /api/v1/weather/current/`
Retrieves the real-time weather observation for the given geographic coordinates or district.

**Query Parameters:**
- `lat` *(optional)*: Latitude (e.g. `22.3039`)
- `lon` *(optional)*: Longitude (e.g. `70.8022`)
- `district` *(optional)*: District name (e.g. `Rajkot`)

**Sample Response (200 OK):**
```json
{
  "temperature": 28.5,
  "condition": "Clear Sky",
  "humidity": 55,
  "wind_speed": 12.4,
  "pressure": 1012,
  "uv_index": 6.2,
  "rainfall": 0.0,
  "location": "Rajkot, Gujarat",
  "recorded_at": "2026-10-18T10:00:00Z"
}
```

### `GET /api/v1/weather/details/`
Returns live weather metrics combined with a 7-day agricultural forecast array and weather advice.

---

## 3. Crop Catalog (`/api/v1/crops/`)

### `GET /api/v1/crops/`
Returns a paginated catalog of agricultural crops with multi-language fields (`name_gu`, `name_hi`).

**Sample Response (200 OK):**
```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Wheat",
      "name_gu": "ઘઉં",
      "name_hi": "गेहूं",
      "season": "Rabi",
      "water_requirement": "Medium",
      "ideal_soil": "Loamy / Clay",
      "temperature_min": 12.0,
      "temperature_max": 25.0
    }
  ]
}
```

### `GET /api/v1/crops/<id>/`
Retrieves in-depth agronomic requirements, fertilizer schedules, and pest profiles for a specific crop.

---

## 4. Soil Analysis (`/api/v1/soil/`)

### `GET /api/v1/soil/by-coordinates/`
Calculates soil fertility metrics based on GPS latitude and longitude.

**Sample Response (200 OK):**
```json
{
  "nitrogen": 140,
  "phosphorus": 35,
  "potassium": 210,
  "ph_level": 7.2,
  "moisture_percent": 42.0,
  "fertility_score": "Optimal",
  "recommended_fertilizer": "Urea + DAP blend with organic vermicompost"
}
```

---

## 5. Market & Government Subsidies (`/api/v1/market/`)

### `GET /api/v1/market/prices/`
Returns live Mandi market commodity rates across regional APMC trading centers.

### `GET /api/v1/market/schemes/`
Returns active state and central government agricultural subsidy programs (PM-KISAN, PMFBY, Soil Health Card Scheme).

### `GET /api/v1/market/calendar/`
Returns the seasonal sowing, weeding, and harvest calendar for the current agro-climatic zone.

---

## 6. Alerts & Diagnostics

### `GET /api/v1/alerts/`
Returns urgent notifications regarding frost warnings, pest outbreaks, and irrigation schedules.

### `POST /api/v1/diagnostics/`
Submits a leaf photo and symptoms for automated disease diagnosis.
- **Request Format**: `multipart/form-data`
- **Fields**:
  - `image`: Leaf image binary file
  - `crop_name`: Target crop (e.g. `Wheat`)
  - `symptoms`: Textual description
