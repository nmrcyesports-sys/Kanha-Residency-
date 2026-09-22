import { Compass, Sparkles, MapPin, Sun, Moon, Utensils, HeartHandshake } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export function ExperiencePage({ onBookStay }: { onBookStay: () => void }) {
  const experiences = [
    {
      title: 'Morning Aarti & Yamuna Parikrama',
      time: '05:30 AM - 08:30 AM',
      tag: 'Sacred Ritual',
      image: 'https://images.unsplash.com/photo-1627894006066-b4520790175b?auto=format&fit=crop&w=800&q=80',
      description: 'Experience early sunrise prayers by the holy Yamuna at Vishram Ghat. Private wooden boat ride along the ancient Mathura riverfront with a knowledgeable local Brajvasi guide.',
    },
    {
      title: 'Shri Krishna Janmabhoomi Darshan',
      time: '09:00 AM - 12:00 PM',
      tag: 'Heritage Sanctum',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      description: 'Just 2.4 km from Kanha Residency. Dedicated front desk assistance with timing advice, locker facilities, and respectful entry guidelines for the revered sanctum sanctorum.',
    },
    {
      title: 'Vrindavan Twilight Pilgrimage',
      time: '04:30 PM - 09:00 PM',
      tag: 'Evening Splendor',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      description: 'Journey 20 minutes to Prem Mandir for the ethereal laser musical fountain illumination, followed by divine Banke Bihari darshan and sweet Braj peda tasting.',
    },
    {
      title: 'Pure Sattvic In-Room Dining',
      time: 'Available 07:00 AM - 10:30 PM',
      tag: 'Culinary Heritage',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      description: 'Delicately prepared traditional North Indian vegetarian meals, light fasting food (vrat thali), fresh Mathura buttermilk, and fragrant herbal tisanes delivered to your suite.',
    },
  ];

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
            Braj Pilgrimage & Serenity
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2] mb-4">
            The Kanha Experience
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998C] font-light leading-relaxed">
            Immerse your senses in the timeless spiritual vibrancy of Mathura. At Kanha Residency, we blend acoustic quietude with attentive temple darshan support.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-16 mb-24">
          {experiences.map((exp, idx) => (
            <div
              key={exp.title}
              className={`flex flex-col lg:flex-row items-center gap-10 rounded-3xl bg-[#141518] border border-[#2D2822] p-6 sm:p-10 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#1A1C22]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1B1D23] border border-[#332E27] text-[#C5A880] text-[10px] uppercase font-bold tracking-wider">
                  <span>{exp.tag}</span>
                  <span>•</span>
                  <span>{exp.time}</span>
                </div>

                <h3 className="font-serif text-3xl text-[#FAF7F2]">{exp.title}</h3>

                <p className="text-sm text-[#B5ABA0] font-light leading-relaxed">
                  {exp.description}
                </p>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    onClick={onBookStay}
                    className="px-6 py-2.5 rounded-full bg-[#C5A880] text-[#121316] text-xs uppercase font-bold tracking-wider hover:bg-[#E5C79E] transition-colors cursor-pointer"
                  >
                    Reserve Your Pilgrimage Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pilgrimage Concierge Assurance */}
        <div className="rounded-3xl bg-gradient-to-r from-[#17181D] to-[#141518] border border-[#3A342B] p-8 sm:p-12 text-center space-y-4">
          <HeartHandshake className="w-10 h-10 text-[#C5A880] mx-auto" />
          <h3 className="font-serif text-3xl text-[#FAF7F2]">Custom Darshan & Temple Guides</h3>
          <p className="text-xs sm:text-sm text-[#A3998C] max-w-xl mx-auto font-light leading-relaxed">
            Our guest relationship desk arranges private air-conditioned cars for the entire 84 Kos Braj Parikrama, Govardhan Hill circumambulation, and Barsana temple visits.
          </p>
          <div className="pt-2">
            <a
              href="tel:+917983629114"
              className="inline-block text-xs uppercase font-bold tracking-widest text-[#C5A880] hover:underline"
            >
              Call Concierge: +91 79836 29114
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
