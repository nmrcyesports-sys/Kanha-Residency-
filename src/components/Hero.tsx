import { useState, useEffect, useRef } from 'react';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AvailabilitySearch } from './AvailabilitySearch';

interface HeroProps {
  onExploreRooms: () => void;
  onBookNow: () => void;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=2000&q=85',
];

export function Hero({ onExploreRooms, onBookNow }: HeroProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 700], ['0%', '18%']);
  const backgroundScale = useTransform(scrollY, [0, 700], [1, 1.12]);
  const textY = useTransform(scrollY, [0, 500], [0, 75]);
  const textOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const searchWidgetY = useTransform(scrollY, [0, 400], [0, -15]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 pt-32 pb-12 overflow-hidden bg-[#0D0E10]"
    >
      {/* Background Images with scroll-driven parallax, scale & fade */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none will-change-transform"
      >
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeImageIndex ? 'opacity-50' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
        ))}

        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-[#0D0E10]/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0D0E10]/30 to-[#0D0E10]/90" />
      </motion.div>

      {/* Top Spacer */}
      <div className="h-6" />

      {/* Central Content with Scroll-Driven Opacity & Translation */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center will-change-transform"
      >
        {/* Brand Eyebrow / Location badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C5A880]/30 bg-[#1A1815]/60 backdrop-blur-md mb-6 animate-in fade-in duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#E5C79E]">
            Kanha Residency
          </span>
          <span className="text-[#6E6457]">•</span>
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#A3998C] flex items-center">
            <MapPin className="w-3 h-3 text-[#C5A880] mr-1 inline" />
            Mathura · Uttar Pradesh
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[0.04em] text-[#FAF7F2] leading-[1.05] uppercase mb-6 drop-shadow-md">
          YOUR STAY, <br />
          <span className="italic font-light text-[#E5C79E]">ELEVATED.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-lg sm:text-2xl italic text-[#D8CFBF] tracking-wide max-w-2xl font-light mb-10 leading-relaxed">
          A refined stay in the heart of Mathura.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-12">
          <button
            onClick={onBookNow}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] via-[#DFBF95] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.22em] shadow-xl shadow-[#C5A880]/25 hover:shadow-[#C5A880]/45 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer luxury-btn-hover"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Your Stay</span>
          </button>

          <button
            onClick={onExploreRooms}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#D4C9BC]/40 bg-[#1A1815]/40 backdrop-blur-sm text-[#FAF7F2] font-semibold text-xs uppercase tracking-[0.22em] hover:bg-[#FAF7F2]/10 hover:border-[#FAF7F2]/70 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer luxury-btn-hover"
          >
            <span>Explore Rooms</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center text-[#A3998C] text-[10px] tracking-[0.25em] uppercase font-medium animate-bounce mb-8">
          <div className="w-5 h-8 rounded-full border border-[#A3998C]/40 flex items-start justify-center p-1 mb-1.5">
            <span className="w-1 h-2 bg-[#C5A880] rounded-full animate-pulse" />
          </div>
          <span>Scroll To Explore</span>
        </div>
      </motion.div>

      {/* Floating Availability Search Widget with Smooth Scroll Parallax */}
      <motion.div
        style={{ y: searchWidgetY }}
        className="relative z-20 w-full max-w-6xl mx-auto px-2"
      >
        <AvailabilitySearch />
      </motion.div>
    </section>
  );
}
