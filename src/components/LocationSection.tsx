import { MapPin, Navigation, Compass, Train, Car, Plane } from 'lucide-react';
import { ScrollReveal } from './ScrollExperience';

export function LocationSection() {
  const directionsUrl =
    'https://www.google.com/maps/dir/23.7811896,86.408605/Kanha+Residency,+CMWM%2BRJX,+Techman+Nilgiri,+Mathura,+Uttar+Pradesh+281006/';

  const transitDistances = [
    { label: 'Mathura Junction Railway Station', distance: '5.2 km', time: '14 mins', icon: Train },
    { label: 'NH-19 Delhi-Agra Expressway', distance: '1.5 km', time: '4 mins', icon: Car },
    { label: 'Shri Krishna Janmasthan', distance: '2.4 km', time: '8 mins', icon: Compass },
    { label: 'Agra Kheria Airport (AGR)', distance: '58 km', time: '1 hr 10 mins', icon: Plane },
  ];

  return (
    <section className="py-24 bg-[#0D0E10] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="left">
              <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
                Find Us
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#FAF7F2]">
                Location & Accessibility
              </h2>
            </div>

            <p className="text-sm text-[#B5ABA0] leading-relaxed font-light">
              Positioned conveniently in the Techman Nilgiri enclave of Mathura, Kanha Residency offers effortless access to holy darshan sites while maintaining an exclusive oasis of quiet.
            </p>

            {/* Address Card */}
            <div className="rounded-2xl bg-[#16171B] border border-[#2D2822] p-5 space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#FAF7F2]">
                    Kanha Residency
                  </h4>
                  <p className="text-xs text-[#A3998C] mt-1 leading-relaxed">
                    CMWM+RJX, Techman Nilgiri, NH-19 corridor, Mathura, Uttar Pradesh 281006
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#25221D] flex flex-wrap gap-2 text-[11px] text-[#C5A880]">
                <span className="px-2.5 py-1 rounded-md bg-[#1B1D23] border border-[#332E27]">
                  GPS Plus Code: CMWM+RJX Mathura
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B1D23] border border-[#332E27]">
                  PIN: 281006
                </span>
              </div>
            </div>

            {/* Transit Points */}
            <div className="space-y-2.5">
              <h5 className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5C79E]">
                Transit & Proximity
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {transitDistances.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="p-3 rounded-xl bg-[#141518] border border-[#25221D] flex items-center space-x-3"
                    >
                      <div className="p-2 rounded-lg bg-[#1B1D23] text-[#C5A880]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-[#FAF7F2] font-medium truncate">{item.label}</div>
                        <div className="text-[10px] text-[#A3998C]">
                          {item.distance} · {item.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Get Directions CTA */}
            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#C5A880]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

          {/* Right Map Visual & Interactive Embed */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden border border-[#332E27] shadow-2xl bg-[#141518] h-[450px]">
                <iframe
                  title="Kanha Residency Mathura Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.9575880702167!2d77.6715!3d27.4924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39737198bb6c8107%3A0x633d735041a38435!2sMathura%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 filter invert contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Location Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs p-4 rounded-2xl bg-[#0D0E10]/90 backdrop-blur-md border border-[#3A342B] shadow-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
                    <span className="font-serif text-sm font-semibold text-[#FAF7F2]">
                      Kanha Residency, Mathura
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A3998C]">
                    Techman Nilgiri Enclave · Safe Private Parking · 24/7 Gate Guard
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
