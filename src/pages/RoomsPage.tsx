import { useState, useEffect } from 'react';
import { RoomCard } from '../components/RoomCard';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import { DEFAULT_ROOMS } from '../data/defaultRooms';
import type { Room } from '../types';
import { Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoomsPageProps {
  onSelectRoom: (room: Room) => void;
  onNavigate: (path: string) => void;
}

export function RoomsPage({ onSelectRoom, onNavigate }: RoomsPageProps) {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [selectedGuests, setSelectedGuests] = useState<number | 'all'>('all');
  const [selectedBed, setSelectedBed] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const { openBookingModal } = useBooking();

  useEffect(() => {
    let isMounted = true;
    api.getRooms()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRooms(data);
        }
      })
      .catch((err) => {
        console.warn('Rooms load fallback active:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (selectedGuests !== 'all' && r.max_guests < selectedGuests) return false;
    if (selectedBed !== 'all') {
      const bed = r.bed_type.toLowerCase();
      if (selectedBed === 'king' && !bed.includes('king')) return false;
      if (selectedBed === 'queen' && !bed.includes('queen') && !bed.includes('twin') && !bed.includes('double')) return false;
    }
    if (r.price > maxPrice) return false;
    return true;
  });

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
            Accommodations
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2] mb-4">
            Rooms & Luxury Suites
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998C] font-light leading-relaxed">
            Designed for mindful travelers, pilgrims, and families visiting Mathura & Vrindavan. Experience soundproof serenity, artisanal woodwork, and gracious Braj hospitality.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl bg-[#141518] border border-[#2D2822] p-4 sm:p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filter Suites:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Guests Filter */}
            <select
              value={selectedGuests}
              onChange={(e) =>
                setSelectedGuests(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-[#1C1E24] border border-[#332E27] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
            >
              <option value="all">All Capacities</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests (Family)</option>
            </select>

            {/* Bed Type */}
            <select
              value={selectedBed}
              onChange={(e) => setSelectedBed(e.target.value)}
              className="bg-[#1C1E24] border border-[#332E27] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
            >
              <option value="all">All Bed Configurations</option>
              <option value="king">King Bed Suites</option>
              <option value="queen">Queen / Family Beds</option>
            </select>

            {/* Price Slider */}
            <div className="flex items-center space-x-2 text-xs text-[#A3998C] bg-[#1C1E24] border border-[#332E27] rounded-xl px-3 py-1.5">
              <span>Max: ₹{maxPrice}</span>
              <input
                type="range"
                min={3000}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#C5A880] cursor-pointer"
              />
            </div>

            {(selectedGuests !== 'all' || selectedBed !== 'all' || maxPrice < 10000) && (
              <button
                onClick={() => {
                  setSelectedGuests('all');
                  setSelectedBed('all');
                  setMaxPrice(10000);
                }}
                className="text-xs text-[#C5A880] underline hover:text-[#FAF7F2]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onViewDetails={(r) => {
                try {
                  localStorage.setItem('kr_selected_room', JSON.stringify(r));
                } catch {
                  // ignore
                }
                onSelectRoom(r);
                onNavigate('/room-detail');
              }}
              onBookNow={(r) => openBookingModal(r)}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-16 text-[#A3998C]">
            <p className="text-base font-serif">No suites match your specific filter.</p>
            <button
              onClick={() => {
                setSelectedGuests('all');
                setSelectedBed('all');
                setMaxPrice(10000);
              }}
              className="mt-3 text-xs text-[#C5A880] underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Included Privileges Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#17181D] via-[#1A1B22] to-[#17181D] border border-[#332E27] p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] block">
              The Kanha Standard
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2]">
              Every Room Includes Compliments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs text-[#D8CFBF]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>High-Speed Wi-Fi</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Artisanal Tea Station</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Temple Darshan Guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Acoustic Quiet Glazing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
