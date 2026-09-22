import { LocationSection } from '../components/LocationSection';
import { Navigation, Train, Car, Compass, CheckCircle2 } from 'lucide-react';

export function LocationPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#0D0E10] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
          Destination & Transit
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2] mb-3">
          Our Location
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998C] font-light max-w-xl mx-auto leading-relaxed">
          Kanha Residency is strategically nestled in Techman Nilgiri, right off the prime Mathura corridor, offering effortless reach to railway junctions and sacred temples.
        </p>
      </div>

      <LocationSection />

      {/* Driving & Arrival Directions Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3">
            <Car className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg text-[#FAF7F2]">From Delhi / NCR via Yamuna Expressway</h4>
            <p className="text-xs text-[#A3998C] leading-relaxed">
              Take the Yamuna Expressway towards Mathura Toll Plaza. Exit towards NH-19 and proceed into Techman Nilgiri. Total driving time approximately 2 hours 15 minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3">
            <Train className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg text-[#FAF7F2]">From Mathura Junction (MTJ)</h4>
            <p className="text-xs text-[#A3998C] leading-relaxed">
              Located only 5.2 km away. Pre-paid taxi and auto-rickshaws are available 24/7 at Platform 1 exit. Approximate commute 12 to 15 minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3">
            <Compass className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg text-[#FAF7F2]">Parking & Security</h4>
            <p className="text-xs text-[#A3998C] leading-relaxed">
              Free secured private parking with 24-hour security guard and CCTV monitoring is available for all registered in-house guest vehicles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
