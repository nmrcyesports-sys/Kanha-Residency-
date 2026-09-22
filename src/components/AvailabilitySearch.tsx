import { useState } from 'react';
import { Calendar, Users, Home, Search, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface AvailabilitySearchProps {
  onSearchComplete?: () => void;
  className?: string;
  variant?: 'hero' | 'compact' | 'inline';
}

export function AvailabilitySearch({
  onSearchComplete,
  className = '',
  variant = 'hero',
}: AvailabilitySearchProps) {
  const { state, setDates, setGuests, openBookingModal } = useBooking();
  const [checkIn, setCheckIn] = useState(state.checkIn);
  const [checkOut, setCheckOut] = useState(state.checkOut);
  const [guests, setLocalGuests] = useState(state.guests);
  const [roomsCount, setLocalRoomsCount] = useState(state.roomsCount);
  const [error, setError] = useState<string | null>(null);

  // Today for min date
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date.');
      return;
    }
    setError(null);
    setDates(checkIn, checkOut);
    setGuests(guests, roomsCount);
    openBookingModal(undefined, { checkIn, checkOut });
    if (onSearchComplete) onSearchComplete();
  };

  return (
    <div
      className={`relative z-20 w-full max-w-5xl mx-auto rounded-2xl bg-[#141518]/95 backdrop-blur-xl border border-[#332E27] p-3 sm:p-5 shadow-2xl shadow-black/80 luxury-card-hover ${className}`}
    >
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Check-In */}
        <div className="flex-1 bg-[#1A1C22]/80 hover:bg-[#1E2028] border border-[#2D2924] hover:border-[#C5A880]/50 rounded-xl px-4 py-2.5 transition-all group luxury-gold-glow">
          <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-1 flex items-center space-x-1.5">
            <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              // Auto bump checkOut if needed
              if (new Date(e.target.value) >= new Date(checkOut)) {
                const nextDay = new Date(e.target.value);
                nextDay.setDate(nextDay.getDate() + 1);
                setCheckOut(nextDay.toISOString().split('T')[0]);
              }
            }}
            className="w-full bg-transparent text-sm text-[#FAF7F2] font-medium focus:outline-none cursor-pointer scheme-dark"
            required
          />
        </div>

        {/* Check-Out */}
        <div className="flex-1 bg-[#1A1C22]/80 hover:bg-[#1E2028] border border-[#2D2924] hover:border-[#C5A880]/50 rounded-xl px-4 py-2.5 transition-all group luxury-gold-glow">
          <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-1 flex items-center space-x-1.5">
            <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>Check-Out</span>
          </label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm text-[#FAF7F2] font-medium focus:outline-none cursor-pointer scheme-dark"
            required
          />
        </div>

        {/* Guests */}
        <div className="flex-1 bg-[#1A1C22]/80 hover:bg-[#1E2028] border border-[#2D2924] hover:border-[#C5A880]/50 rounded-xl px-4 py-2.5 transition-all group luxury-gold-glow">
          <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-1 flex items-center space-x-1.5">
            <Users className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>Guests</span>
          </label>
          <select
            value={guests}
            onChange={(e) => setLocalGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-[#FAF7F2] font-medium focus:outline-none cursor-pointer [&>option]:bg-[#1A1C22] [&>option]:text-[#FAF7F2]"
          >
            <option value={1}>1 Adult</option>
            <option value={2}>2 Adults</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests (Family)</option>
            <option value={5}>5+ Guests (Group)</option>
          </select>
        </div>

        {/* Rooms */}
        <div className="flex-1 bg-[#1A1C22]/80 hover:bg-[#1E2028] border border-[#2D2924] hover:border-[#C5A880]/50 rounded-xl px-4 py-2.5 transition-all group luxury-gold-glow">
          <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-1 flex items-center space-x-1.5">
            <Home className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>Rooms</span>
          </label>
          <select
            value={roomsCount}
            onChange={(e) => setLocalRoomsCount(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-[#FAF7F2] font-medium focus:outline-none cursor-pointer [&>option]:bg-[#1A1C22] [&>option]:text-[#FAF7F2]"
          >
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
            <option value={4}>4+ Rooms</option>
          </select>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="lg:w-auto w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#DFBF95] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.25em] shadow-lg shadow-[#C5A880]/20 hover:shadow-[#C5A880]/40 flex items-center justify-center space-x-2 shrink-0 cursor-pointer luxury-btn-hover group"
        >
          <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>Check Availability</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-rose-400 text-center font-medium">{error}</p>
      )}
    </div>
  );
}
