# SmartKrushi — Developer & Contribution Guide

This guide details code conventions, branch strategies, testing workflows, and best practices for developing on the **SmartKrushi** platform.

---

## 1. Development Principles

1. **Safety First**: Never modify active production database records without backing up `db.sqlite3`.
2. **Preserve Native Separation**: The mobile app lives in `frontend/` (React Native/Expo). Never import web-only DOM packages (like `react-router-dom` or `div/span` tags) into `frontend/`.
3. **No Blind Dependency Installation**: Always use `npx expo install <package>` for React Native dependencies to guarantee Expo SDK 57 compatibility.
4. **DRY & Modular**: Keep reusable components in `frontend/src/components/ui.js` and design tokens in `frontend/src/constants/theme.js`.

---

## 2. Adding a New Mobile Screen

Expo Router uses file-based routing:
1. Create a new JavaScript file under `frontend/src/app/` (e.g., `frontend/src/app/irrigation.js`).
2. Export a default React functional component:
   ```javascript
   import { View, Text, StyleSheet } from 'react-native';
   import { Header, Card } from '../components/ui';

   export default function IrrigationScreen() {
     return (
       <View style={styles.container}>
         <Header title="Irrigation Advisory" />
         <Card style={styles.card}>
           <Text>Irrigation schedule based on soil moisture.</Text>
         </Card>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#F6F8F5', padding: 16 },
     card: { marginTop: 16 }
   });
   ```
3. To add this screen to the bottom tab bar, edit `frontend/src/app/(tabs)/_layout.js` and declare:
   ```javascript
   <Tabs.Screen
     name="irrigation"
     options={{
       title: 'Irrigation',
       tabBarIcon: ({ color, size }) => (
         <Ionicons name="water-outline" size={size} color={color} />
       ),
     }}
   />
   ```

---

## 3. Adding a New Backend App

1. From `smartkrushi/backend`, create the app:
   ```powershell
   python manage.py startapp irrigation
   ```
2. Register the app in `config/settings.py` under `INSTALLED_APPS`:
   ```python
   INSTALLED_APPS = [
       ...
       'irrigation',
   ]
   ```
3. Define models in `irrigation/models.py`.
4. Generate and apply migrations:
   ```powershell
   python manage.py makemigrations irrigation
   python manage.py migrate
   ```
5. Create `irrigation/serializers.py` and `irrigation/views.py`.
6. Wire routes in `config/urls.py`:
   ```python
   path('api/v1/irrigation/', include('irrigation.urls')),
   ```

---

## 4. Testing Workflow

### Backend Tests
Always run both endpoint and unit test suites before committing:
```powershell
# Integration API tests
python manage.py test tests

# Core unit tests
python manage.py test weather crops accounts soil plant_health dashboard locations
```

### Frontend Syntax & Verification
```powershell
node frontend/tests/verify_frontend.js
```

### Full-Stack Repository Check
```powershell
node tests/verify_project.js
```
