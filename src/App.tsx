import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { MapPage } from './pages/MapPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { CulturePage } from './pages/CulturePage';
import { EventsPage } from './pages/EventsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ItinerariesPage } from './pages/ItinerariesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResponsibleTourismPage } from './pages/ResponsibleTourismPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destination/:id" element={<DestinationDetailPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/plan-trip" element={<PlanTripPage />} />
                <Route path="/culture" element={<CulturePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/itineraries" element={<ItinerariesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/responsible-tourism" element={<ResponsibleTourismPage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Fallback */}
                <Route path="*" element={<ExplorePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
