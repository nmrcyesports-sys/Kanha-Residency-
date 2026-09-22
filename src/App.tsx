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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(() => {
    try {
      const saved = localStorage.getItem('kr_selected_room');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch {}
    return null;
  });
  const { openBookingModal } = useBooking();
  const { user, isAdmin, isManager } = useAuth();

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    try {
      localStorage.setItem('kr_selected_room', JSON.stringify(room));
    } catch {}
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clean path without query strings, hashes, or trailing slashes
  const rawPath = currentPath.split('?')[0].split('#')[0] || '/';
  const normalizedPath = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;

  // Admin Route Protection
  const isAdminRoute = normalizedPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#E8E2D9] flex flex-col font-sans relative">
      {/* Golden Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Show Navbar on all public pages */}
      {!isAdminRoute && (
        <Navbar currentPath={normalizedPath} onNavigate={navigate} />
      )}

      {/* Main Page Routing */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={normalizedPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="w-full"
          >
            {isAdminRoute ? (
              <AdminLayout onNavigate={navigate} />
            ) : normalizedPath === '/rooms' ? (
              <RoomsPage
                onSelectRoom={handleSelectRoom}
                onNavigate={navigate}
              />
            ) : normalizedPath === '/room-detail' ? (
              <RoomDetailPage
                room={selectedRoom}
                onNavigate={navigate}
              />
            ) : normalizedPath === '/experience' ? (
              <ExperiencePage
                onBookStay={() => openBookingModal()}
              />
            ) : normalizedPath === '/gallery' ? (
              <GalleryPage />
            ) : normalizedPath === '/location' ? (
              <LocationPage />
            ) : normalizedPath === '/contact' ? (
              <ContactPage />
            ) : normalizedPath === '/login' ? (
              <AuthPages initialMode="login" onNavigate={navigate} />
            ) : normalizedPath === '/register' ? (
              <AuthPages initialMode="register" onNavigate={navigate} />
            ) : normalizedPath === '/account' ? (
              <GuestAccountPage onNavigate={navigate} />
            ) : normalizedPath === '/terms' ? (
              <LegalPages initialTab="terms" />
            ) : normalizedPath === '/privacy' ? (
              <LegalPages initialTab="privacy" />
            ) : normalizedPath === '/cancellation' ? (
              <LegalPages initialTab="cancellation" />
            ) : normalizedPath === '/cookies' ? (
              <LegalPages initialTab="cookies" />
            ) : normalizedPath === '/disclaimer' ? (
              <LegalPages initialTab="disclaimer" />
            ) : (
              <HomePage
                onNavigate={navigate}
                onSelectRoom={handleSelectRoom}
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
