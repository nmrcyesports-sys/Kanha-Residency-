import { useState, useEffect } from 'react';
import { X, ZoomIn, Eye, Sparkles } from 'lucide-react';
import type { GalleryItem } from '../types';
import { api } from '../services/api';
import { ScrollReveal } from './ScrollExperience';

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

  return (
    <section className="py-24 bg-[#0A0B0D] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
              Captured Moments
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2] mb-4">
              The Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#A3998C] font-light leading-relaxed">
              Immerse yourself in the bespoke architecture, tranquil interiors, and sacred Mathura heritage of Kanha Residency.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal delay={0.1} direction="up">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer luxury-pill-hover ${
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
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 4) * 0.08} direction="up" className={index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}>
              <div
                onClick={() => setActiveLightboxItem(item)}
                className={`group relative overflow-hidden rounded-2xl bg-[#141518] border border-[#2B2721] cursor-pointer luxury-card-hover w-full ${
                  index % 5 === 0 ? 'h-96 sm:h-full min-h-[320px]' : 'h-64 sm:h-72'
                }`}
              >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Hover Details */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-[#121316]/80 text-[#C5A880] backdrop-blur-md">
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
          </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute -top-12 right-0 p-2 text-[#FAF7F2] hover:text-[#C5A880] transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-7 h-7" />
            </button>

            <img
              src={activeLightboxItem.image}
              alt={activeLightboxItem.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
              }}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-[#332E27]"
            />

            <div className="mt-4 text-center">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                {activeLightboxItem.category}
              </span>
              <h3 className="font-serif text-2xl text-[#FAF7F2] mt-1">
                {activeLightboxItem.title}
              </h3>
              <p className="text-sm text-[#A3998C] font-light mt-1 max-w-xl mx-auto">
                {activeLightboxItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
