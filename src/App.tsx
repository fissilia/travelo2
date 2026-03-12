import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/hooks/useAppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { DestinationsSection } from '@/sections/DestinationsSection';
import { PromotionsSection } from '@/sections/PromotionsSection';
import { CollectionsSection } from '@/sections/CollectionsSection';
import { ReviewsSection } from '@/sections/ReviewsSection';
import { SearchPage } from '@/pages/SearchPage';
import { HotelDetailPage } from '@/pages/HotelDetailPage';
import { FlightDetailPage } from '@/pages/FlightDetailPage';
import { TrainDetailPage } from '@/pages/TrainDetailPage';
import { VehicleDetailPage } from '@/pages/VehicleDetailPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BookingsPage } from '@/pages/BookingsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { ChatPage } from '@/pages/ChatPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationsSection />
      <PromotionsSection />
      <CollectionsSection />
      <ReviewsSection />
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Auth Pages (without header/footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main Pages */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/search/:type" element={<Layout><SearchPage /></Layout>} />
          <Route path="/hotel/:id" element={<Layout><HotelDetailPage /></Layout>} />
          <Route path="/flight/:id" element={<Layout><FlightDetailPage /></Layout>} />
          <Route path="/train/:id" element={<Layout><TrainDetailPage /></Layout>} />
          <Route path="/vehicle/:id" element={<Layout><VehicleDetailPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
          <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
