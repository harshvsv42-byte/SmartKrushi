# SmartKrushi — Complete Technical Documentation
## AI-Powered Smart Agriculture Assistant Platform

> **Project**: SmartKrushi  
> **Stack**: Django REST Framework (Backend) + React Native / Expo (Mobile Frontend)  
> **Database**: SQLite3 (Dev) / MySQL (Production)  
> **Version**: 1.0  
> **Date**: October 2026

---

## Table of Contents

| No. | Diagram | Category |
|-----|---------|----------|
| 1 | [System Architecture Diagram](#1-system-architecture-diagram) | System Design |
| 2 | [System Context Diagram](#2-system-context-diagram) | Architecture |
| 3 | [Use Case Diagram](#3-use-case-diagram) | UML |
| 4 | [Activity Diagram](#4-activity-diagram) | UML |
| 5 | [Class Diagram](#5-class-diagram) | UML |
| 6 | [Sequence Diagram](#6-sequence-diagram) | UML |
| 7 | [Component Diagram](#7-component-diagram) | UML |
| 8 | [Deployment Diagram](#8-deployment-diagram) | UML |
| 9 | [ER Diagram](#9-er-diagram) | Database |
| 10 | [DFD Level 0](#10-dfd-level-0) | Data Flow |
| 11 | [DFD Level 1](#11-dfd-level-1) | Data Flow |
| 12 | [Crop Recommendation Workflow](#12-crop-recommendation-workflow) | Process Design |
| 13 | [Plant Disease Diagnosis Workflow](#13-plant-disease-diagnosis-workflow) | Process Design |
| 14 | [Weather API Integration Diagram](#14-weather-api-integration-diagram) | API Integration |
| 15 | [Research Methodology Flowchart](#15-research-methodology-flowchart) | Research Work |

---

## 1. System Architecture Diagram

**Category**: System Design  
**Description**: Shows the overall multi-tier architecture of SmartKrushi — from the client layer to the backend, persistence, and external APIs.

```mermaid
graph TB
    subgraph CLIENT["CLIENT LAYER"]
        Mobile["📱 React Native Mobile App\n(Expo SDK 57 / Android)"]
        Web["🌐 React Web App\n(Vite + React 19)"]
    end

    subgraph BACKEND["BACKEND LAYER — Django REST Framework (Port 8000)"]
        Auth["🔐 JWT Auth\n(SimpleJWT)"]
        CORS["🔄 CORS Headers"]
        Swagger["📄 Swagger / OpenAPI"]

        subgraph APPS["Django Apps"]
            W["weather"]
            C["crops"]
            S["soil"]
            PH["plant_health"]
            D["dashboard"]
            A["accounts"]
            R["recommendations"]
            F["fertilizers"]
            L["locations"]
            CB["chatbot"]
        end
    end

    subgraph DB["PERSISTENCE LAYER"]
        SQLite["🗄️ SQLite3\n(Development)"]
        MySQL["🗄️ MySQL\n(Production)"]
        Media["📁 Media Storage\n(Leaf Photos)"]
    end

    subgraph EXT["EXTERNAL INTEGRATIONS"]
        OWM["🌤️ OpenWeather\nSite API"]
        OM["🌦️ Open-Meteo\n(Fallback)"]
        EAS["☁️ Expo EAS\nBuild System"]
    end

    Mobile -- "HTTP REST /api/v1/" --> BACKEND
    Web -- "HTTP REST /api/v1/" --> BACKEND
    BACKEND --> DB
    BACKEND --> EXT
```

---

## 2. System Context Diagram

**Category**: Architecture  
**Description**: High-level view showing SmartKrushi as a black box and all external actors that interact with it.

```mermaid
graph LR
    Farmer["👨‍🌾 Farmer\n(Primary User)"]
    Expert["🧑‍💼 Agri Expert\n(Advisory Role)"]
    Admin["🛡️ System Admin"]
    OWM["🌤️ OpenWeather API\n(External)"]
    OM["🌦️ Open-Meteo API\n(External)"]
    EAS["☁️ Expo EAS\n(External Build)"]

    SK(["🌱 SmartKrushi\nPlatform"])

    Farmer -- "Uses Mobile App\n(Weather, Soil, Disease, Crops)" --> SK
    Expert -- "Manages Advisories\n& Crop Data" --> SK
    Admin -- "Manages Users\n& System Config" --> SK
    SK -- "Fetch Weather Data" --> OWM
    SK -- "Fetch Fallback Weather" --> OM
    SK -- "Build & Deploy APK" --> EAS
```

---

## 3. Use Case Diagram

**Category**: UML  
**Description**: All use cases available to the three primary actors — Farmer, Agri Expert, and Admin.

```mermaid
graph LR
    subgraph Actors
        F["👨‍🌾 Farmer"]
        E["🧑‍💼 Agri Expert"]
        A["🛡️ Admin"]
    end

    subgraph UseCases["SmartKrushi Use Cases"]
        UC1["Register / Login"]
        UC2["View Live Weather"]
        UC3["Get Soil NPK Analysis"]
        UC4["Browse Crop Catalog"]
        UC5["Get Crop Recommendations"]
        UC6["Diagnose Plant Disease\n(Upload Leaf Photo)"]
        UC7["View Market Mandi Prices"]
        UC8["Check Govt Schemes"]
        UC9["Ask AI Chatbot"]
        UC10["Manage Crop Records"]
        UC11["Manage Users & Profiles"]
        UC12["View Dashboard Alerts"]
    end

    F --> UC1
    F --> UC2
    F --> UC3
    F --> UC4
    F --> UC5
    F --> UC6
    F --> UC7
    F --> UC8
    F --> UC9
    F --> UC12

    E --> UC1
    E --> UC10
    E --> UC4
    E --> UC5

    A --> UC11
    A --> UC10
    A --> UC1
```

---

## 4. Activity Diagram

**Category**: UML  
**Description**: Step-by-step activity flow for the core farmer journey — from login to getting a crop recommendation.

```mermaid
flowchart TD
    Start([🟢 Start]) --> Login["Open SmartKrushi App"]
    Login --> Auth{"Logged In?"}
    Auth -- No --> Register["Register / Login\nwith Phone or Username"]
    Register --> Auth
    Auth -- Yes --> Dashboard["View Dashboard\n(Weather + Alerts)"]
    Dashboard --> Choose{"Choose Action"}

    Choose -- "Soil Analysis" --> GPS["Get GPS Location"]
    GPS --> SoilAPI["Call /api/v1/soil/\nby-coordinates/"]
    SoilAPI --> ShowSoil["Display NPK, pH,\nFertility Score"]
    ShowSoil --> Recommend["Get Crop\nRecommendation"]

    Choose -- "Disease Check" --> Camera["Open Camera\n& Capture Leaf"]
    Camera --> Upload["Upload Photo to\nPOST /api/v1/diagnostics/"]
    Upload --> Diagnosis["Display Disease Name,\nSymptoms & Treatment"]

    Choose -- "Market Prices" --> Market["Fetch APMC\nMandi Rates"]
    Market --> ShowMarket["Display Commodity\nPrice Table"]

    Recommend --> End([🔴 End])
    Diagnosis --> End
    ShowMarket --> End
```

---

## 5. Class Diagram

**Category**: UML  
**Description**: Key Django model classes and their relationships across the SmartKrushi backend.

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string password
    }

    class FarmerProfile {
        +int id
        +string full_name
        +string phone_number
        +string role
        +string state
        +string district
        +float farm_size
        +string primary_crops
        +string preferred_language
        +datetime created_at
    }

    class Crop {
        +int id
        +string crop_name
        +string scientific_name
        +string crop_category
        +string growing_season
        +int crop_duration_days
        +string suitable_soil
        +float suitable_ph_min
        +float suitable_ph_max
        +float temperature_min
        +float temperature_max
        +string water_requirement
    }

    class CropRecord {
        +int id
        +string state
        +string district
        +string crop_name
        +string growing_season
        +float area_hectares
        +float production_tonnes
        +float yield_kg_per_hectare
        +int year
    }

    class PlantDisease {
        +int id
        +string crop_name
        +string disease_name
        +string disease_category
        +string symptoms
        +string treatment
        +string severity
    }

    class SoilRecord {
        +int id
        +string state
        +string district
        +string soil_type
        +float soil_ph
        +float nitrogen
        +float phosphorus
        +float potassium
        +string ph_category
    }

    class WeatherRecord {
        +int id
        +string district
        +float latitude
        +float longitude
        +float temperature
        +float humidity
        +float rainfall
        +float wind_speed
        +datetime recorded_at
        +string data_source
    }

    User "1" --> "1" FarmerProfile : has profile
    Crop "1" --> "many" CropRecord : has records
    Crop "1" --> "many" PlantDisease : has diseases
```

---

## 6. Sequence Diagram

**Category**: UML  
**Description**: Detailed interaction sequence for Plant Disease Diagnosis — from farmer camera click to diagnosis result.

```mermaid
sequenceDiagram
    actor Farmer as 👨‍🌾 Farmer
    participant App as 📱 Expo Mobile App
    participant API as 🖥️ Django REST API
    participant View as diagnostics_views.py
    participant DB as 🗄️ SQLite DB + Media

    Farmer->>App: Clicks "Diagnose Disease"
    App->>App: Opens device camera
    Farmer->>App: Captures leaf photo
    App->>App: Wraps image in FormData
    App->>API: POST /api/v1/diagnostics/\n{image, crop_name, symptoms}
    API->>View: Routes to DiagnosticView
    View->>DB: Saves image to media/
    View->>DB: Saves DiagnosisRecord
    View->>View: Matches PlantDisease model\nby crop_name + symptoms
    View-->>API: Returns {disease_name, treatment, severity}
    API-->>App: JSON Response 200 OK
    App-->>Farmer: Shows diagnosis card\nwith treatment steps
```

---

## 7. Component Diagram

**Category**: UML  
**Description**: Major software components of SmartKrushi and how they interface with each other.

```mermaid
graph TB
    subgraph Frontend["📱 Frontend (React Native / Expo)"]
        Router["Expo Router\n(Navigation)"]
        Screens["Screens\n(Weather, Soil, Disease, Market)"]
        APIClient["api.js\n(HTTP Client)"]
        Components["UI Components\n(Header, Card, Badge)"]
    end

    subgraph Backend["🖥️ Backend (Django REST Framework)"]
        URLs["URL Router\nconfig/urls.py"]
        WeatherApp["weather app"]
        CropsApp["crops app"]
        SoilApp["soil app"]
        PlantApp["plant_health app"]
        DashApp["dashboard app"]
        AuthApp["accounts app"]
        RecommApp["recommendations app"]
    end

    subgraph Persistence["🗄️ Persistence"]
        DB["SQLite3 / MySQL"]
        Media["Media Storage"]
    end

    subgraph External["🌐 External APIs"]
        OWM["OpenWeather API"]
        OpenMeteo["Open-Meteo API"]
    end

    Screens --> APIClient
    APIClient -- "REST /api/v1/" --> URLs
    URLs --> WeatherApp
    URLs --> CropsApp
    URLs --> SoilApp
    URLs --> PlantApp
    URLs --> DashApp
    URLs --> AuthApp
    URLs --> RecommApp

    WeatherApp --> OWM
    WeatherApp --> OpenMeteo
    PlantApp --> Media
    CropsApp --> DB
    SoilApp --> DB
    AuthApp --> DB
```

---

## 8. Deployment Diagram

**Category**: UML  
**Description**: Physical deployment of SmartKrushi across developer machine, Android device, and cloud.

```mermaid
graph TB
    subgraph DevMachine["💻 Developer / Server Machine"]
        subgraph BackendServer["Django WSGI Server (Port 8000)"]
            DjangoApp["Django REST Framework\n+ SQLite3 DB"]
            MediaFiles["Media Files\n(Leaf Photos)"]
        end
        subgraph MetroBundler["Expo Metro Bundler"]
            ExpoDev["Expo Dev Server"]
        end
    end

    subgraph AndroidPhone["📱 Android Device (via Wi-Fi / USB)"]
        ExpoGo["Expo Go App\nor Standalone APK"]
    end

    subgraph Cloud["☁️ Expo EAS Cloud"]
        EASBuild["EAS Build\n(APK Generator)"]
    end

    subgraph ExternalAPI["🌐 External APIs"]
        OWM["OpenWeather API\napi.openweathermap.org"]
        OM["Open-Meteo API\napi.open-meteo.com"]
    end

    ExpoGo -- "HTTP REST API\n192.168.x.x:8000" --> BackendServer
    BackendServer -- "Weather Data\nRequests" --> OWM
    BackendServer -- "Fallback Weather\nRequests" --> OM
    MetroBundler -- "QR Code / LAN" --> ExpoGo
    DevMachine -- "eas build" --> EASBuild
    EASBuild -- "Download .apk" --> AndroidPhone
```

---

## 9. ER Diagram

**Category**: Database  
**Description**: Entity-Relationship diagram showing all major database tables and their relationships.

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        string password
    }

    FARMER_PROFILE {
        int id PK
        int user_id FK
        string full_name
        string phone_number
        string role
        string state
        string district
        string taluka
        float farm_size
        string primary_crops
        string preferred_language
        datetime created_at
    }

    CROP {
        int id PK
        string crop_name
        string crop_category
        string growing_season
        int crop_duration_days
        float suitable_ph_min
        float suitable_ph_max
        float temperature_min
        float temperature_max
        string water_requirement
    }

    CROP_RECORD {
        int id PK
        int crop_id FK
        string state
        string district
        string crop_name
        float area_hectares
        float yield_kg_per_hectare
        int year
    }

    PLANT_DISEASE {
        int id PK
        int crop_id FK
        string disease_name
        string disease_category
        string symptoms
        string treatment
        string severity
    }

    SOIL_RECORD {
        int id PK
        string state
        string district
        string soil_type
        float soil_ph
        float nitrogen
        float phosphorus
        float potassium
        datetime sample_date
    }

    WEATHER_RECORD {
        int id PK
        string district
        float latitude
        float longitude
        float temperature
        float humidity
        float rainfall
        datetime recorded_at
        string data_source
    }

    USER ||--|| FARMER_PROFILE : "has"
    CROP ||--o{ CROP_RECORD : "has records"
    CROP ||--o{ PLANT_DISEASE : "has diseases"
```

---

## 10. DFD Level 0

**Category**: Data Flow  
**Description**: Top-level data flow — SmartKrushi system as a single process with all external entities.

```mermaid
flowchart LR
    Farmer(["👨‍🌾 Farmer"])
    Expert(["🧑‍💼 Agri Expert"])
    Admin(["🛡️ Admin"])
    OWM(["🌤️ OpenWeather API"])
    OM(["🌦️ Open-Meteo API"])

    SK[["🌱 SmartKrushi\nSystem (Process 0)"]]

    Farmer -- "Login, Location, Leaf Photo,\nCrop Query" --> SK
    SK -- "Weather Report, Soil Analysis,\nDiagnosis, Recommendations" --> Farmer

    Expert -- "Crop & Advisory Data" --> SK
    SK -- "Reports & Analytics" --> Expert

    Admin -- "User & Config Management" --> SK
    SK -- "System Logs & Status" --> Admin

    OWM -- "Live Weather JSON" --> SK
    OM -- "Fallback Weather JSON" --> SK
```

---

## 11. DFD Level 1

**Category**: Data Flow  
**Description**: Decomposed data flow showing all major sub-processes within SmartKrushi.

```mermaid
flowchart TD
    Farmer(["👨‍🌾 Farmer"])
    OWM(["🌤️ OpenWeather\nAPI"])
    OM(["🌦️ Open-Meteo\nAPI"])

    P1["1.0 Authentication\n& Profile Mgmt"]
    P2["2.0 Weather\nIntelligence"]
    P3["3.0 Soil Analysis\n& NPK Report"]
    P4["4.0 Crop\nCatalog & Records"]
    P5["5.0 Plant Disease\nDiagnostics"]
    P6["6.0 Market Prices\n& Govt Schemes"]
    P7["7.0 Crop\nRecommendation Engine"]

    DS1[("D1: users / farmer_profiles")]
    DS2[("D2: weather_records")]
    DS3[("D3: soil_records")]
    DS4[("D4: crops / crop_records")]
    DS5[("D5: plant_diseases / pests")]
    DS6[("D6: market_prices / schemes")]

    Farmer -- "Credentials" --> P1
    P1 -- "Auth Token" --> Farmer
    P1 <--> DS1

    Farmer -- "GPS Coords" --> P2
    P2 -- "Weather Report" --> Farmer
    OWM -- "Live Weather" --> P2
    OM -- "Fallback" --> P2
    P2 <--> DS2

    Farmer -- "GPS / Location" --> P3
    P3 -- "NPK + pH Report" --> Farmer
    P3 <--> DS3

    Farmer -- "Browse Request" --> P4
    P4 -- "Crop Details" --> Farmer
    P4 <--> DS4

    Farmer -- "Leaf Photo + Symptoms" --> P5
    P5 -- "Disease + Treatment" --> Farmer
    P5 <--> DS5

    Farmer -- "District Name" --> P6
    P6 -- "Mandi Rates + Schemes" --> Farmer
    P6 <--> DS6

    P3 -- "Soil Data" --> P7
    P2 -- "Weather Data" --> P7
    P4 -- "Crop Info" --> P7
    P7 -- "Best Crop Advice" --> Farmer
```

---

## 12. Crop Recommendation Workflow

**Category**: Process Design  
**Description**: End-to-end workflow showing how SmartKrushi generates a crop recommendation based on soil, weather, and farmer input.

```mermaid
flowchart TD
    Start([🟢 Farmer Opens App]) --> GetLoc["📍 Detect GPS Location\n(Latitude + Longitude)"]
    GetLoc --> FetchWeather["🌤️ Fetch Current Weather\nfrom OpenWeather / Open-Meteo"]
    FetchWeather --> FetchSoil["🌱 Fetch Soil Data\nfrom /api/v1/soil/by-coordinates/"]
    FetchSoil --> CollectInputs["📋 Collect Farmer Inputs:\n- Preferred Season (Kharif/Rabi/Zaid)\n- Farm Size (hectares)\n- Water Availability"]

    CollectInputs --> FilterCrops["🔍 Filter Crop Catalog\nby Season + Soil pH Match"]
    FilterCrops --> CheckTemp{"🌡️ Temperature\nWithin Crop Range?"}
    CheckTemp -- No --> RemoveCrop["❌ Remove Crop\nfrom List"]
    RemoveCrop --> FilterCrops
    CheckTemp -- Yes --> CheckWater{"💧 Water Requirement\nvs Rainfall Match?"}
    CheckWater -- No --> LowPriority["⬇️ Mark as\nLow Priority"]
    CheckWater -- Yes --> HighPriority["⬆️ Mark as\nHigh Priority"]

    LowPriority --> RankList["📊 Rank Crop List\nby Suitability Score"]
    HighPriority --> RankList
    RankList --> ShowResults["✅ Display Top 3–5\nRecommended Crops\nwith Fertilizer Advice"]
    ShowResults --> End([🔴 Done])
```

---

## 13. Plant Disease Diagnosis Workflow

**Category**: Process Design  
**Description**: Complete step-by-step workflow for plant disease diagnosis via camera image upload.

```mermaid
flowchart TD
    Start([🟢 Farmer Selects\n'Diagnose Disease']) --> OpenCamera["📷 Open Device Camera\nor Select from Gallery"]
    OpenCamera --> Capture["📸 Capture Leaf Photo"]
    Capture --> EnterCrop["✍️ Enter Crop Name\n& Describe Symptoms"]
    EnterCrop --> Validate{"✅ Image\nAttached?"}
    Validate -- No --> OpenCamera
    Validate -- Yes --> Upload["📤 POST /api/v1/diagnostics/\n{image, crop_name, symptoms}"]

    Upload --> SaveMedia["💾 Save Image to\nmedia/plant_health/"]
    SaveMedia --> SaveRecord["🗄️ Create DiagnosisRecord\nin SQLite DB"]
    SaveRecord --> MatchDisease["🔍 Match Against\nPlantDisease Table\nby crop_name + symptoms"]
    MatchDisease --> Found{"Disease\nFound?"}

    Found -- Yes --> BuildResponse["📋 Prepare Response:\n- Disease Name\n- Category (Fungal/Viral/etc.)\n- Severity Level\n- Symptoms\n- Organic Treatment\n- Chemical Treatment\n- Prevention Tips"]
    Found -- No --> GenericAdvice["ℹ️ Return Generic\nAgricultural Advice\n+ Recommend Expert Visit"]

    BuildResponse --> ReturnJSON["📡 Return JSON 200 OK"]
    GenericAdvice --> ReturnJSON
    ReturnJSON --> DisplayCard["📱 Show Diagnosis Card\nto Farmer"]
    DisplayCard --> End([🔴 Done])
```

---

## 14. Weather API Integration Diagram

**Category**: API Integration  
**Description**: Shows how SmartKrushi fetches weather data from two sources with fallback logic.

```mermaid
flowchart TD
    Request["📱 App Requests Weather\nGPS: lat, lon OR district name"] --> WeatherView["🖥️ WeatherView\n(weather/views.py)"]
    WeatherView --> WeatherService["⚙️ WeatherService\n(weather/services.py)"]

    WeatherService --> CheckKey{"🔑 OPENWEATHER\nAPI_KEY Set?"}

    CheckKey -- Yes --> CallOWM["🌤️ Call OpenWeather API\nhttps://api.openweathermap.org\n/data/2.5/weather?lat=&lon=&appid="]
    CallOWM --> OWMSuccess{"✅ HTTP 200?"}
    OWMSuccess -- Yes --> ParseOWM["Parse OWM JSON:\ntemp, humidity, wind,\nrainfall, condition"]
    OWMSuccess -- No --> Fallback["⚠️ Fallback to\nOpen-Meteo"]

    CheckKey -- No --> Fallback
    Fallback --> CallOM["🌦️ Call Open-Meteo\nhttps://api.open-meteo.com\n/v1/forecast?lat=&lon="]
    CallOM --> ParseOM["Parse Open-Meteo JSON:\ntemp, humidity, rainfall,\nwind_speed"]

    ParseOWM --> SaveDB["💾 Save to\nWeatherRecord (DB)"]
    ParseOM --> SaveDB

    SaveDB --> BuildResp["📋 Build Response:\n{temperature, humidity,\nrainfall, wind_speed,\ncondition, location,\nrecorded_at}"]
    BuildResp --> ReturnApp["📡 Return JSON to\nMobile App"]
    ReturnApp --> ShowUI["📱 Display Weather\nDashboard to Farmer"]
```

---

## 15. Research Methodology Flowchart

**Category**: Research Work  
**Description**: Research methodology followed in the design, development, and validation of the SmartKrushi platform.

```mermaid
flowchart TD
    Start([🟢 Research Start]) --> ProbDef["📌 Problem Definition\nIdentify farmer pain points:\n• No real-time weather\n• No soil analysis tools\n• No disease diagnosis\n• Language barriers"]

    ProbDef --> LitReview["📚 Literature Review\n• IoT in Agriculture\n• ML-based Disease Detection\n• Existing AgriTech Apps\n• APMC Market Systems"]

    LitReview --> GapAnalysis["🔍 Gap Analysis\nExisting apps lack:\n• Multilingual support\n• Offline-first design\n• Integrated soil + weather\n• Hyperlocal Mandi prices"]

    GapAnalysis --> Objectives["🎯 Define Objectives\n1. Real-time weather telemetry\n2. Soil NPK analysis\n3. AI plant disease diagnosis\n4. Crop recommendation engine\n5. Market price integration"]

    Objectives --> SystemDesign["🏗️ System Design\n• Multi-tier architecture\n• REST API design\n• Database schema\n• Mobile-first UI/UX"]

    SystemDesign --> Implementation["💻 Implementation\n• Django REST Framework (Backend)\n• React Native / Expo (Frontend)\n• SQLite3 (Database)\n• OpenWeather API (External)"]

    Implementation --> Testing["🧪 Testing\n• 36 Django integration tests\n• Frontend route integrity check\n• Full-stack verification suite\n• Physical Android device testing"]

    Testing --> Validation{"✅ All Tests\nPassed?"}
    Validation -- No --> Debug["🐛 Debug & Fix\nIssues"]
    Debug --> Testing

    Validation -- Yes --> Deployment["🚀 Deployment\n• EAS Cloud APK build\n• Expo Go QR distribution\n• Backend on production server"]

    Deployment --> Evaluation["📊 Evaluation\n• Farmer usability testing\n• Disease diagnosis accuracy\n• Weather data correctness\n• Response time benchmarks"]

    Evaluation --> Conclusion(["🔴 Research Conclusion\n& Future Scope"])
```

---

## Summary

| Module | Technology | Purpose |
|--------|-----------|---------|
| **Mobile App** | React Native + Expo | Farmer-facing interface |
| **Web App** | Vite + React 19 | Desktop companion portal |
| **Backend API** | Django 6.1 + DRF 3.18 | REST API & business logic |
| **Database** | SQLite3 / MySQL | Data persistence |
| **Weather** | OpenWeather + Open-Meteo | Live weather telemetry |
| **Auth** | SimpleJWT | Secure token authentication |
| **Build** | Expo EAS | Android APK cloud build |
| **Docs** | Swagger / OpenAPI | Interactive API explorer |

---

*SmartKrushi — Empowering Indian Farmers with AI-Powered Agricultural Intelligence.*
