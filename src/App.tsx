import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { BookingModal } from './components/BookingModal';
import { ScrollProgressBar, ScrollToTopButton } from './components/ScrollExperience';

import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { GalleryPage } from './pages/GalleryPage';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPages } from './pages/AuthPages';
import { GuestAccountPage } from './pages/GuestAccountPage';
import { LegalPages } from './pages/LegalPages';
import { AdminLayout } from './pages/AdminLayout';
import type { Room } from './types';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { openBookingModal } = useBooking();
  const { user, isAdmin, isManager } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Route Protection
  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#E8E2D9] flex flex-col font-sans relative">
      {/* Golden Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Show Navbar on all public pages */}
      {!isAdminRoute && (
        <Navbar currentPath={currentPath} onNavigate={navigate} />
      )}

      {/* Main Page Routing */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {isAdminRoute ? (
              <AdminLayout onNavigate={navigate} />
            ) : currentPath === '/rooms' ? (
              <RoomsPage
                onSelectRoom={(r) => setSelectedRoom(r)}
                onNavigate={navigate}
              />
            ) : currentPath === '/room-detail' ? (
              <RoomDetailPage
                room={selectedRoom}
                onNavigate={navigate}
              />
            ) : currentPath === '/experience' ? (
              <ExperiencePage
                onBookStay={() => openBookingModal()}
              />
            ) : currentPath === '/gallery' ? (
              <GalleryPage />
            ) : currentPath === '/location' ? (
              <LocationPage />
            ) : currentPath === '/contact' ? (
              <ContactPage />
            ) : currentPath === '/login' ? (
              <AuthPages initialMode="login" onNavigate={navigate} />
            ) : currentPath === '/register' ? (
              <AuthPages initialMode="register" onNavigate={navigate} />
            ) : currentPath === '/account' ? (
              <GuestAccountPage onNavigate={navigate} />
            ) : currentPath === '/terms' ? (
              <LegalPages initialTab="terms" />
            ) : currentPath === '/privacy' ? (
              <LegalPages initialTab="privacy" />
            ) : currentPath === '/cancellation' ? (
              <LegalPages initialTab="cancellation" />
            ) : currentPath === '/cookies' ? (
              <LegalPages initialTab="cookies" />
            ) : (
              <HomePage
                onNavigate={navigate}
                onSelectRoom={(r) => setSelectedRoom(r)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      {!isAdminRoute && (
        <Footer onNavigate={navigate} />
      )}

      {/* Global Booking Engine Modal */}
      <BookingModal />

      {/* GDPR / Privacy Cookie Banner */}
      <CookieBanner onOpenPolicy={() => navigate('/privacy')} />

      {/* Floating Scroll To Top Ring */}
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  );
}
