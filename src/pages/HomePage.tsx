import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { RoomCard } from '../components/RoomCard';
import { ExperienceSection } from '../components/ExperienceSection';
import { GallerySection } from '../components/GallerySection';
import { LocationSection } from '../components/LocationSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ContactSection } from '../components/ContactSection';
import { ScrollReveal } from '../components/ScrollExperience';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import type { Room } from '../types';
import { ArrowRight, Sparkles, Shield, Award, HeartHandshake } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectRoom: (room: Room) => void;
}

export function HomePage({ onNavigate, onSelectRoom }: HomePageProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { openBookingModal } = useBooking();

  useEffect(() => {
    api.getRooms().then(setRooms).catch(console.warn);
  }, []);

  const handleBookRoom = (room: Room) => {
    openBookingModal(room);
  };

  const handleViewDetails = (room: Room) => {
    onSelectRoom(room);
    onNavigate('/room-detail');
  };

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen">
      {/* Cinematic Hero */}
      <Hero
        onExploreRooms={() => {
          const el = document.getElementById('rooms-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else onNavigate('/rooms');
        }}
        onBookNow={() => openBookingModal()}
      />

      {/* Trust & Accreditations Banner */}
      <section className="border-y border-[#26221C] bg-[#121316] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal delay={0.05} direction="up">
              <div className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:bg-[#181920] hover:scale-[1.03] group cursor-default">
                <Award className="w-6 h-6 text-[#C5A880] mb-2 group-hover:scale-110 group-hover:text-[#E5C79E] transition-transform duration-300" />
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#E5C79E] transition-colors">
                  Verified Premium Stay
                </h4>
                <p className="text-[11px] text-[#A3998C] mt-0.5">Top-Rated Mathura Hospitality</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} direction="up">
              <div className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:bg-[#181920] hover:scale-[1.03] group cursor-default">
                <Shield className="w-6 h-6 text-[#C5A880] mb-2 group-hover:scale-110 group-hover:text-[#E5C79E] transition-transform duration-300" />
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#E5C79E] transition-colors">
                  Guaranteed Best Rate
                </h4>
                <p className="text-[11px] text-[#A3998C] mt-0.5">Direct Booking Exclusives</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25} direction="up">
              <div className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:bg-[#181920] hover:scale-[1.03] group cursor-default">
                <Sparkles className="w-6 h-6 text-[#C5A880] mb-2 group-hover:scale-110 group-hover:text-[#E5C79E] transition-transform duration-300" />
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#E5C79E] transition-colors">
                  Temple Darshan Desk
                </h4>
                <p className="text-[11px] text-[#A3998C] mt-0.5">Private Guide & Transit Care</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.35} direction="up">
              <div className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:bg-[#181920] hover:scale-[1.03] group cursor-default">
                <HeartHandshake className="w-6 h-6 text-[#C5A880] mb-2 group-hover:scale-110 group-hover:text-[#E5C79E] transition-transform duration-300" />
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#E5C79E] transition-colors">
                  Authentic Sattvic Dining
                </h4>
                <p className="text-[11px] text-[#A3998C] mt-0.5">Pure Vegetarian Hygiene</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Rooms & Suites Showcase */}
      <section id="rooms-section" className="py-28 bg-[#0D0E10] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#25221D]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
                  Comfort & Elegance
                </span>
                <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2]">
                  Our Rooms & Suites
                </h2>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <p className="max-w-sm text-xs sm:text-sm text-[#A3998C] font-light leading-relaxed hidden sm:block">
                  Each room is designed with artisanal teak finishes, luxurious plush bedding, and calming acoustic insulation.
                </p>
                <button
                  onClick={() => onNavigate('/rooms')}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] hover:text-[#FAF7F2] transition-all group luxury-pill-hover py-2 px-3 rounded-lg"
                >
                  <span>View All Accommodations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room, idx) => (
              <ScrollReveal key={room.id} delay={idx * 0.1} direction="up">
                <RoomCard
                  room={room}
                  onViewDetails={handleViewDetails}
                  onBookNow={handleBookRoom}
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2} direction="up">
            <div className="mt-12 text-center">
              <button
                onClick={() => onNavigate('/rooms')}
                className="px-8 py-3.5 rounded-full border border-[#C5A880] text-[#C5A880] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C5A880] hover:text-[#121316] transition-all cursor-pointer luxury-btn-hover shadow-lg hover:shadow-[#C5A880]/20"
              >
                Browse Complete Room Collection & Amenities
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection
        onExploreMore={() => onNavigate('/experience')}
        onBookExperienceStay={() => openBookingModal()}
      />

      {/* Gallery Section */}
      <GallerySection />

      {/* Location Section */}
      <LocationSection />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Contact Concierge Section */}
      <ContactSection />
    </div>
  );
}
