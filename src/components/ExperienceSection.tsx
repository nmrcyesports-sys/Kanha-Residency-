import { Compass, Sparkles, MapPin, Clock, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollExperience';

interface ExperienceSectionProps {
  onExploreMore?: () => void;
  onBookExperienceStay?: () => void;
}

export function ExperienceSection({ onExploreMore, onBookExperienceStay }: ExperienceSectionProps) {
  const pillars = [
    {
      title: 'Comfort',
      tagline: 'Artisanal Linens & Climate Control',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      description: 'Handpicked plush mattresses, double-glazed acoustic soundproofing, and custom temperature zoning for peaceful rest after sacred parikrama.',
    },
    {
      title: 'Hospitality',
      tagline: 'Sattvic Care & Temple Concierge',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      description: 'Warm Braj welcomes with fragrant chandan, artisanal herbal teas, and dedicated darshan concierge assistance.',
    },
    {
      title: 'Location',
      tagline: 'Minutes From Janmabhoomi & Yamuna',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      description: 'Conveniently situated along Mathura’s prime corridor, ensuring seamless transit to sacred temples, ghats, and Vrindavan.',
    },
    {
      title: 'Peaceful Stay',
      tagline: 'Quiet Courtyards & Reflective Zen',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      description: 'A sanctuary away from the bustling bazaars, providing a serene environment for contemplation and family rejuvenation.',
    },
  ];

  const attractions = [
    {
      name: 'Shri Krishna Janmabhoomi',
      category: 'Mathura Heritage',
      distance: '2.4 km',
      travelTime: '8 mins',
      description: 'The revered sacred birthplace of Lord Krishna, featuring ancient sanctums, stone carvings, and tranquil prayer halls.',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Vishram Ghat & Yamuna Aarti',
      category: 'Sacred Ritual',
      distance: '3.5 km',
      travelTime: '12 mins',
      description: 'The historic riverbank ghat where Lord Krishna rested. Mesmerizing evening brass lamp ceremonies and quiet boat journeys.',
      image: 'https://images.unsplash.com/photo-1627894006066-b4520790175b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Prem Mandir, Vrindavan',
      category: 'Architectural Marvel',
      distance: '11.2 km',
      travelTime: '22 mins',
      description: 'Magnificent white Italian marble temple with intricate dioramas depicting the divine pastimes of Shri Radha Krishna.',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Banke Bihari Temple',
      category: 'Vrindavan Darshan',
      distance: '12.4 km',
      travelTime: '25 mins',
      description: 'One of the most sacred temples of Lord Krishna in Braj Bhumi, celebrated for spontaneous devotion and sweet kirtan.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-24 bg-[#0D0E10] text-[#FAF7F2] relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A880]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#25221D]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
                More Than A Stay
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2]">
                The Kanha Experience
              </h2>
            </div>
            <p className="mt-4 md:mt-0 max-w-md text-sm text-[#B5ABA0] leading-relaxed font-light">
              From serene mornings to peaceful evenings, every moment at Kanha Residency is thoughtfully crafted for your comfort, devotion, and relaxation.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Brand Pillars Grid with ScrollReveal Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {pillars.map((pillar, idx) => (
            <ScrollReveal key={pillar.title} delay={idx * 0.1} direction="up">
              <div
                className="group relative rounded-2xl overflow-hidden bg-[#141518] border border-[#2D2822] hover:border-[#C5A880]/60 transition-all duration-500 flex flex-col justify-end min-h-[380px] p-6 shadow-xl luxury-card-hover"
              >
                {/* Background Photo */}
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/60 to-transparent" />

                {/* Pillar Details */}
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] mb-1.5 block">
                    {pillar.tagline}
                  </span>
                  <h3 className="font-serif text-3xl font-medium text-[#FAF7F2] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#D8CFBF] leading-relaxed line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Sacred Mathura Attractions Banner */}
        <ScrollReveal delay={0.2} direction="up">
          <div className="rounded-3xl bg-gradient-to-b from-[#16171B] to-[#121316] border border-[#332E27] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-[#2D2822]">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#E5C79E] mb-2 font-medium">
                <Compass className="w-4 h-4 text-[#C5A880]" />
                <span>Braj Pilgrimage Circuit</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2]">
                Sacred Landmarks Near Kanha Residency
              </h3>
            </div>
            {onExploreMore && (
              <button
                onClick={onExploreMore}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] hover:text-[#FAF7F2] transition-colors"
              >
                <span>View Full Pilgrimage Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Attraction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attractions.map((attraction) => (
              <div
                key={attraction.name}
                className="rounded-xl bg-[#1A1C22]/80 border border-[#2D2822] p-4 flex flex-col justify-between hover:border-[#C5A880]/50 transition-colors"
              >
                <div>
                  <div className="relative h-36 rounded-lg overflow-hidden mb-3.5">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#121316]/80 text-[#C5A880] text-[9px] uppercase font-bold tracking-wider">
                      {attraction.category}
                    </div>
                  </div>

                  <h4 className="font-serif text-lg font-medium text-[#FAF7F2] mb-1.5">
                    {attraction.name}
                  </h4>
                  <p className="text-xs text-[#B5ABA0] line-clamp-3 leading-relaxed mb-4">
                    {attraction.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#25221D] flex items-center justify-between text-xs text-[#C5A880]">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#A3998C]" />
                    <span className="font-medium text-[#FAF7F2]">{attraction.distance}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-[#A3998C]">
                    <Clock className="w-3 h-3" />
                    <span>~{attraction.travelTime}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Concierge Assistance Note */}
          <div className="mt-8 pt-6 border-t border-[#25221D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3998C]">
            <p className="flex items-center space-x-2 text-center sm:text-left">
              <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>
                Our Front Desk Concierge provides private chauffeur bookings and priority temple darshan guidance for in-house guests.
              </span>
            </p>
            {onBookExperienceStay && (
              <button
                onClick={onBookExperienceStay}
                className="px-5 py-2 rounded-full bg-[#C5A880] text-[#121316] font-bold text-[11px] uppercase tracking-wider shrink-0 cursor-pointer hover:bg-[#E5C79E] transition-colors"
              >
                Reserve Your Stay
              </button>
            )}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
