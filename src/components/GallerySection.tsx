import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '../types';
import { api } from '../services/api';

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    title: 'Grand Facade & Evening Illumination',
    category: 'Property',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    description: 'Evening ambience and architectural warmth at Kanha Residency',
    sort_order: 1,
    status: 'Active',
  },
  {
    id: 'gal_2',
    title: 'Deluxe Suite Living Sanctuary',
    category: 'Rooms',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'Plush bedding and tailored wooden finishes',
    sort_order: 2,
    status: 'Active',
  },
  {
    id: 'gal_3',
    title: 'Handcrafted Lobby & Concierge Lounge',
    category: 'Interiors',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    description: 'Intricate brass lamps and warm stone surfaces',
    sort_order: 3,
    status: 'Active',
  },
  {
    id: 'gal_4',
    title: 'Shri Krishna Janmabhoomi Darshan',
    category: 'Mathura',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    description: 'The sacred birthplace of Lord Krishna in Mathura (10 mins away)',
    sort_order: 4,
    status: 'Active',
  },
  {
    id: 'gal_5',
    title: 'Prem Mandir Evening Light Illumination',
    category: 'Experience',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    description: 'Mesmerizing Italian marble temple in nearby Vrindavan',
    sort_order: 5,
    status: 'Active',
  },
  {
    id: 'gal_6',
    title: 'Morning Yamuna Aarti at Vishram Ghat',
    category: 'Mathura',
    image: 'https://images.unsplash.com/photo-1627894006066-b4520790175b?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional morning prayers and sacred river reflections',
    sort_order: 6,
    status: 'Active',
  },
  {
    id: 'gal_7',
    title: 'Artisanal Dining & Sattvic Breakfast',
    category: 'Interiors',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    description: 'Freshly prepared vegetarian nourishment for body and soul',
    sort_order: 7,
    status: 'Active',
  },
  {
    id: 'gal_8',
    title: 'Courtyard Water Feature & Zen Seating',
    category: 'Property',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
    description: 'Reflective pond and meditation seating for quiet contemplation',
    sort_order: 8,
    status: 'Active',
  },
];

export function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    api.getGallery()
      .then((data) => {
        if (data && data.length > 0) setItems(data);
      })
      .catch((err) => console.warn('Failed to load gallery:', err));
  }, []);

  const categories = ['All', 'Property', 'Rooms', 'Interiors', 'Experience', 'Mathura'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const currentIndex = activeLightboxItem
    ? filteredItems.findIndex((it) => it.id === activeLightboxItem.id)
    : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (filteredItems.length === 0) return;
    const prevIdx = currentIndex <= 0 ? filteredItems.length - 1 : currentIndex - 1;
    setActiveLightboxItem(filteredItems[prevIdx]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (filteredItems.length === 0) return;
    const nextIdx = currentIndex >= filteredItems.length - 1 ? 0 : currentIndex + 1;
    setActiveLightboxItem(filteredItems[nextIdx]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activeLightboxItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxItem(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxItem, currentIndex, filteredItems]);

  // Lock background body scroll cleanly without touching documentElement
  useEffect(() => {
    if (activeLightboxItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeLightboxItem]);

  return (
    <section id="gallery-section" className="py-20 sm:py-24 bg-[#0A0B0D] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
            Captured Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF7F2] mb-4">
            The Gallery
          </h2>
          <p className="text-xs sm:text-sm text-[#A3998C] font-light leading-relaxed">
            Immerse yourself in the bespoke architecture, tranquil interiors, and sacred Mathura heritage of Kanha Residency.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#C5A880] text-[#121316] font-bold shadow-md shadow-[#C5A880]/20'
                    : 'bg-[#16171B] text-[#A3998C] hover:text-[#FAF7F2] border border-[#2D2822]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid: Direct, instant click without motion wrappers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className={`group relative overflow-hidden rounded-2xl bg-[#141518] border border-[#2B2721] cursor-pointer hover:border-[#C5A880]/70 transition-all duration-200 w-full ${
                index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2 h-80 sm:h-full min-h-[300px]' : 'h-64 sm:h-72'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-200" />

              {/* Hover Details & Zoom Icon */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex justify-end">
                  <span className="p-2.5 rounded-full bg-[#121316]/90 text-[#C5A880] shadow-md border border-[#3A332A]">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] mb-1 block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#FAF7F2] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#D8CFBF] line-clamp-2 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Mounted Directly to document.body via Portal: Guarantees zero scroll, zero containing block bugs, instant display right in front */}
      {activeLightboxItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] h-screen w-screen bg-black/95 flex flex-col justify-between p-3 sm:p-6 select-none touch-none overscroll-contain"
            onClick={() => setActiveLightboxItem(null)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Category, Counter & Close Button */}
            <div
              className="flex items-center justify-between w-full max-w-6xl mx-auto shrink-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] bg-[#18191D] border border-[#3A332A]">
                  {activeLightboxItem.category}
                </span>
                {filteredItems.length > 1 && currentIndex >= 0 && (
                  <span className="text-xs text-[#A3998C] font-mono">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                )}
              </div>

              <button
                onClick={() => setActiveLightboxItem(null)}
                className="p-2.5 rounded-full bg-[#18191D] hover:bg-[#2A2621] text-[#FAF7F2] hover:text-[#C5A880] border border-[#3A332A] transition-colors cursor-pointer shadow-lg"
                aria-label="Close photo preview"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Visual Display: Exactly centered in viewport */}
            <div
              className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex items-center justify-center relative my-2 px-2 sm:px-14"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Photo Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#18191D]/90 hover:bg-[#2A2621] text-[#FAF7F2] hover:text-[#C5A880] border border-[#3A332A] transition-colors cursor-pointer shadow-2xl"
                  aria-label="Previous photo"
                  title="Previous photo (Left arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Photo: Bounded to viewport, instant render right in front */}
              <div className="w-full h-full flex items-center justify-center p-1">
                <img
                  key={activeLightboxItem.id}
                  src={activeLightboxItem.image}
                  alt={activeLightboxItem.title}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-[#3A332A]"
                />
              </div>

              {/* Next Photo Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#18191D]/90 hover:bg-[#2A2621] text-[#FAF7F2] hover:text-[#C5A880] border border-[#3A332A] transition-colors cursor-pointer shadow-2xl"
                  aria-label="Next photo"
                  title="Next photo (Right arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Compact Caption Footer */}
            <div
              className="w-full max-w-3xl mx-auto text-center shrink-0 z-10 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-lg sm:text-2xl text-[#FAF7F2] font-normal truncate">
                {activeLightboxItem.title}
              </h3>
              {activeLightboxItem.description && (
                <p className="text-xs sm:text-sm text-[#A3998C] font-light mt-0.5 line-clamp-1">
                  {activeLightboxItem.description}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
