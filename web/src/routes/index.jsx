import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import DiagnosticsPage from '../pages/DiagnosticsPage';
import MarketPage from '../pages/MarketPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import WeatherDetailsPage from '../pages/WeatherDetailsPage';
import CropListPage from '../pages/CropListPage';
import CropDetailPage from '../pages/CropDetailPage';
import SoilDetailsPage from '../pages/SoilDetailsPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main app wrapped in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="weather" element={<WeatherDetailsPage />} />
        <Route path="crops" element={<CropListPage />} />
        <Route path="crops/:id" element={<CropDetailPage />} />
        <Route path="soil" element={<SoilDetailsPage />} />
        <Route path="diagnostics" element={<DiagnosticsPage />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="about" element={<AboutPage />} />

        {/* Authenticated user profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 handler */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
