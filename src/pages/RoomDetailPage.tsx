import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Users,
  Bed,
  Maximize2,
  Check,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  ZoomIn,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Room } from '../types';
import { DEFAULT_ROOMS } from '../data/defaultRooms';
import { useBooking } from '../context/BookingContext';

interface RoomDetailPageProps {
  room: Room | null;
  onNavigate: (path: string) => void;
}

export function RoomDetailPage({ room, onNavigate }: RoomDetailPageProps) {
  const { openBookingModal } = useBooking();

  // Resolve active room from prop, localStorage, URL query, or default room
  const activeRoom: Room = (() => {
    if (room) return room;
    try {
      const saved = localStorage.getItem('kr_selected_room');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name) return parsed as Room;
      }
    } catch {}
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get('id');
    if (idFromQuery) {
      const match = DEFAULT_ROOMS.find((r) => r.id === idFromQuery || r.slug === idFromQuery);
      if (match) return match;
    }
    return DEFAULT_ROOMS[0];
  })();

  const [selectedImage, setSelectedImage] = useState<string>(activeRoom.featured_image);
  const [isPhotoPopOpen, setIsPhotoPopOpen] = useState(false);

  useEffect(() => {
    if (activeRoom) {
      setSelectedImage(activeRoom.featured_image);
      try {
        localStorage.setItem('kr_selected_room', JSON.stringify(activeRoom));
      } catch {}
    }
  }, [activeRoom.id]);

  useEffect(() => {
    if (isPhotoPopOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isPhotoPopOpen]);

  const gallery = [activeRoom.featured_image, ...(activeRoom.images || [])];

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(activeRoom.price);

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-[#A3998C] mb-8">
          <button
            onClick={() => onNavigate('/rooms')}
            className="flex items-center space-x-1 hover:text-[#FAF7F2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Rooms Collection</span>
          </button>
          <span>/</span>
          <span className="text-[#C5A880] font-medium">{activeRoom.name}</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#25221D] gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] mb-2 block">
              Kanha Residency · Mathura
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF7F2]">
              {activeRoom.name}
            </h1>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C79E]">
              {formattedPrice}
            </span>
            <span className="text-xs text-[#A3998C]">/ night (excl. 12% GST)</span>
          </div>
        </div>

        {/* Gallery Grid & Main Display */}
        <div className="space-y-4 mb-14">
          <div
            onClick={() => setIsPhotoPopOpen(true)}
            className="group relative h-[400px] sm:h-[550px] w-full rounded-3xl overflow-hidden bg-[#141518] border border-[#2D2822] cursor-pointer hover:border-[#C5A880]/60 transition-all duration-300"
          >
            <img
              src={selectedImage}
              alt={activeRoom.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10]/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-6 right-6 p-2.5 rounded-full bg-[#121316]/90 text-[#C5A880] border border-[#3A332A] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
              <ZoomIn className="w-5 h-5" />
            </div>

            <div className="absolute bottom-6 left-6 text-xs text-[#E5C79E] bg-[#121316]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#3A342B] flex items-center space-x-2">
              <span>Photography of {activeRoom.name}</span>
              <span className="text-[#A3998C]">• Click to expand</span>
            </div>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#C5A880] scale-105 shadow-md shadow-[#C5A880]/20'
                      : 'border-[#2D2822] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room Photo Pop-out Lightbox */}
        {isPhotoPopOpen &&
          createPortal(
            <div
              onClick={() => setIsPhotoPopOpen(false)}
              className="fixed inset-0 z-[99999] h-screen w-screen bg-black/95 flex flex-col justify-between p-4 sm:p-8 select-none touch-none overscroll-contain"
            >
              {/* Top Header */}
              <div
                className="flex items-center justify-between w-full max-w-6xl mx-auto shrink-0 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-widest text-[#C5A880] bg-[#18191D] border border-[#3A332A]">
                  {activeRoom.name} Photography
                </span>
                <button
                  onClick={() => setIsPhotoPopOpen(false)}
                  className="p-2.5 rounded-full bg-[#18191D] text-[#FAF7F2] hover:text-[#C5A880] border border-[#3A332A] cursor-pointer shadow-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Centered Image directly in front */}
              <div
                className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex items-center justify-center p-2 sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt={activeRoom.name}
                  decoding="async"
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl border border-[#3A332A]"
                />
              </div>

              {/* Caption */}
              <div
                className="text-center shrink-0 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs text-[#A3998C] font-light">
                  Click anywhere or press Esc to close
                </p>
              </div>
            </div>,
            document.body
          )}

        {/* Main Content Grid: Left specs, Right Sticky Book Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-[#141518] border border-[#2D2822] text-center">
              <div>
                <Users className="w-5 h-5 text-[#C5A880] mx-auto mb-1.5" />
                <div className="text-[10px] text-[#A3998C] uppercase tracking-wider">Occupancy</div>
                <div className="text-sm font-semibold text-[#FAF7F2]">{activeRoom.max_guests} Guests</div>
              </div>
              <div>
                <Bed className="w-5 h-5 text-[#C5A880] mx-auto mb-1.5" />
                <div className="text-[10px] text-[#A3998C] uppercase tracking-wider">Bed Type</div>
                <div className="text-sm font-semibold text-[#FAF7F2]">{activeRoom.bed_type}</div>
              </div>
              <div>
                <Maximize2 className="w-5 h-5 text-[#C5A880] mx-auto mb-1.5" />
                <div className="text-[10px] text-[#A3998C] uppercase tracking-wider">Living Area</div>
                <div className="text-sm font-semibold text-[#FAF7F2]">{activeRoom.room_size}</div>
              </div>
            </div>

            {/* In-Depth Description */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#FAF7F2]">The Experience</h3>
              <p className="text-sm text-[#C4B8A9] font-light leading-relaxed">
                {activeRoom.description || activeRoom.short_description}
              </p>
              <p className="text-sm text-[#C4B8A9] font-light leading-relaxed">
                Positioned in Mathura's tranquil Techman Nilgiri quarter, this suite offers a calm retreat after visiting Shri Krishna Janmabhoomi and attending the holy evening Yamuna Aarti at Vishram Ghat.
              </p>
            </div>

            {/* Room Amenities Breakdown */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#FAF7F2]">Room Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRoom.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#15171D] border border-[#262420]"
                  >
                    <div className="p-1 rounded-full bg-[#C5A880]/15 text-[#C5A880]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-[#FAF7F2] font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay Policies */}
            <div className="space-y-4 p-6 rounded-2xl bg-[#141518] border border-[#2D2822]">
              <h4 className="font-serif text-xl text-[#FAF7F2]">Suite Rules & Policies</h4>
              <ul className="space-y-2 text-xs text-[#A3998C] leading-relaxed">
                <li>• Check-in: 14:00 PM IST | Check-out: 11:00 AM IST</li>
                <li>• Free cancellation is supported up to 48 hours prior to check-in.</li>
                <li>• All guests must provide valid government photo ID upon arrival.</li>
                <li>• Pure vegetarian and alcohol-free property respecting Braj pilgrim sanctum.</li>
              </ul>
            </div>
          </div>

          {/* Right Sticky Booking Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-[#16171B] border border-[#3A342B] p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] block mb-1">
                  Direct Stay Guarantee
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif text-3xl font-bold text-[#E5C79E]">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-[#A3998C]">/ night</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free cancellation up to 48 hours</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#25221D] space-y-3">
                <button
                  onClick={() => openBookingModal(activeRoom)}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A880] via-[#DFBF95] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.22em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book This Room</span>
                </button>

                <p className="text-[11px] text-center text-[#8C8377]">
                  Instant confirmation · Direct reservation with Kanha Residency
                </p>
              </div>

              {/* Concierge Assistance */}
              <div className="pt-4 border-t border-[#25221D] text-xs text-[#A3998C] space-y-2">
                <div className="font-semibold text-[#FAF7F2]">Prefer personalized assistance?</div>
                <div>Call our 24/7 Darshan Desk:</div>
                <a
                  href="tel:+917983629114"
                  className="text-xs text-[#C5A880] font-medium hover:underline block"
                >
                  +91 79836 29114
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
