import { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, Shield, Calendar, Phone, MapPin, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, isManager, logout } = useAuth();
  const { openBookingModal } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' },
    { label: 'Experience', path: '/experience' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/#reviews-section' },
    { label: 'Location', path: '/location' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
      return;
    }
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0D0E10]/90 backdrop-blur-md border-b border-[#2A2621]/60 py-2.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#0D0E10]/80 via-[#0D0E10]/30 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Kanha Residency Home"
            >
              <BrandLogo size={isScrolled ? 'sm' : 'md'} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`relative text-xs uppercase tracking-[0.2em] font-medium py-1 transition-colors duration-300 ${
                      isActive
                        ? 'text-[#C5A880] font-semibold'
                        : 'text-[#E8E2D9]/80 hover:text-[#FFF8EE]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-4">
              {/* Admin Quick Switch (if admin/manager) */}
              {(isAdmin || isManager) && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#E5C79E] text-xs uppercase tracking-wider hover:bg-[#C5A880]/20 transition-all"
                  title="Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}

              {/* User Account / Login */}
              {user ? (
                <div className="relative group">
                  <button
                    onClick={() => handleLinkClick(isAdmin ? '/admin' : '/account')}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#3A352F] bg-[#17181C] text-xs text-[#E8E2D9] hover:border-[#C5A880] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="text-xs uppercase tracking-[0.18em] font-medium text-[#E8E2D9]/90 hover:text-[#C5A880] transition-colors px-3 py-1.5"
                >
                  Sign In
                </button>
              )}

              {/* Book Your Stay CTA */}
              <button
                onClick={() => openBookingModal()}
                className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] via-[#D8BC94] to-[#B89758] text-[#121316] font-semibold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#C5A880]/20 hover:shadow-[#C5A880]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span className="relative z-10 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Your Stay</span>
                </span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => openBookingModal()}
                className="px-3 py-1.5 rounded-full bg-[#C5A880] text-[#121316] text-[10px] uppercase font-bold tracking-wider sm:hidden"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#E8E2D9] hover:text-[#C5A880] hover:bg-[#1A1B20] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0D0E10]/98 backdrop-blur-xl lg:hidden flex flex-col justify-between p-6 pt-24 animate-in fade-in duration-300">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-center pb-4 border-b border-[#2A2621]">
              <BrandLogo size="md" showTagline />
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`text-left text-lg font-serif tracking-[0.1em] py-2 border-b border-[#1E1F24] transition-colors ${
                      isActive ? 'text-[#C5A880] font-bold pl-2' : 'text-[#E8E2D9] hover:text-[#C5A880]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {user ? (
                <button
                  onClick={() => handleLinkClick(isAdmin ? '/admin' : '/account')}
                  className="text-left text-lg font-serif tracking-[0.1em] py-2 border-b border-[#1E1F24] text-[#C5A880]"
                >
                  My Account ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="text-left text-lg font-serif tracking-[0.1em] py-2 border-b border-[#1E1F24] text-[#E8E2D9]"
                >
                  Sign In / Register
                </button>
              )}

              {(isAdmin || isManager) && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="text-left text-lg font-serif tracking-[0.1em] py-2 border-b border-[#1E1F24] text-[#E5C79E] flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#2A2621] space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Your Stay Now</span>
            </button>

            <div className="flex items-center justify-between text-xs text-[#A3998C] pt-2">
              <a href="tel:+917983629114" className="flex items-center space-x-1.5 hover:text-[#C5A880]">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 79836 29114</span>
              </a>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Mathura, UP</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
