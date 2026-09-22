import { useState } from 'react';
import { Shield, FileText, CheckCircle2, Lock, Scale, AlertCircle } from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'terms' | 'privacy' | 'cancellation' | 'cookies' | 'disclaimer';
}

export function LegalPages({ initialTab = 'terms' }: LegalPagesProps) {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'cancellation' | 'cookies' | 'disclaimer'>(initialTab);

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
            Compliance & Transparency
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF7F2] mb-3">
            Policies & Legal Terms
          </h1>
          <p className="text-xs text-[#A3998C]">
            Effective Date: January 1, 2026 · Kanha Residency, Mathura, UP 281006
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-6 border-b border-[#25221D]">
          {[
            { id: 'terms', label: 'Terms & Conditions', icon: Scale },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'cancellation', label: 'Cancellation & Refund', icon: FileText },
            { id: 'cookies', label: 'Cookie Policy', icon: Shield },
            { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C5A880] text-[#121316]'
                    : 'bg-[#16171B] text-[#A3998C] hover:text-[#FAF7F2] border border-[#2D2822]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 sm:p-12 text-xs sm:text-sm text-[#B5ABA0] leading-relaxed space-y-6">
          {tab === 'terms' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Terms and Conditions</h2>
              <p>
                Welcome to Kanha Residency, Mathura. By accessing our website, creating an account, or reserving accommodations, you agree to comply with and be bound by the following terms.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">1. Check-In & Identity Verification</h3>
              <p>
                Pursuant to Government of Uttar Pradesh tourism regulations, all domestic Indian citizens must present a valid government-issued photo identity proof (Aadhaar Card, Passport, or Voter ID Card) upon check-in. Foreign nationals must present a valid Passport and Indian Visa / OCI card. PAN cards are not accepted as address proof.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">2. Property Sanctum & Conduct</h3>
              <p>
                Kanha Residency is located in the sacred pilgrimage city of Mathura. The possession or consumption of non-vegetarian food, alcohol, and illicit substances on the premises is strictly prohibited. Smoking is prohibited in all indoor guest suites and public lounges.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">3. Tariff & Price Recalculation</h3>
              <p>
                All room rates displayed on our portal are validated and calculated directly on our server-side reservation engine. Rates exclude the applicable 12% Goods and Services Tax (GST) unless specified. Payment must be authorized through our verified gateway before booking confirmation is granted.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Privacy Policy</h2>
              <p>
                At Kanha Residency, we respect your personal data and privacy. This policy outlines how your reservation records, contact details, and payment identifiers are securely processed.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">1. Information We Collect</h3>
              <p>
                When you make a reservation, we collect your full legal name, telephone number, email address, residence city, stay dates, and special pilgrim requests. We do not store raw credit card numbers or banking passwords on our servers.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">2. How We Use Your Data</h3>
              <p>
                Your information is used strictly to issue booking confirmation vouchers, process required police verification entries, arrange requested temple darshan assistance, and send critical stay updates via email/SMS.
              </p>
              <h3 className="font-serif text-lg text-[#FAF7F2]">3. Data Security</h3>
              <p>
                All communication between your browser and our booking engine is encrypted using industry-standard Transport Layer Security (TLS 1.3 / 256-bit SSL).
              </p>
            </div>
          )}

          {tab === 'cancellation' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Cancellation & Refund Policy</h2>
              <div className="p-4 rounded-xl bg-[#1C1E26] border border-[#C5A880]/30 text-[#E5C79E]">
                <strong>Standard Policy:</strong> Free cancellation up to 48 hours prior to check-in time (14:00 PM IST on scheduled arrival day).
              </div>
              <h3 className="font-serif text-lg text-[#FAF7F2]">1. Refund Eligibility Timeline</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cancellation 48+ Hours Before Arrival:</strong> 100% full refund of the total booking amount credited back to original payment method.
                </li>
                <li>
                  <strong>Cancellation Within 48 Hours:</strong> A retention fee equivalent to 1 night’s room tariff + tax will be deducted; any remaining balance refunded.
                </li>
                <li>
                  <strong>No-Show or Early Departure:</strong> Non-refundable.
                </li>
              </ul>
              <h3 className="font-serif text-lg text-[#FAF7F2]">2. Processing Window</h3>
              <p>
                Refunds authorized by our management or initiated via the Guest Portal are submitted to our payment gateway immediately and typically reflect in your bank account within 5 to 7 business days.
              </p>
            </div>
          )}

          {tab === 'cookies' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Cookie & Tracking Policy</h2>
              <p>
                We use cookies and local storage tokens strictly to maintain authenticated guest sessions, retain your selected check-in/out dates, and remember your cookie preferences.
              </p>
              <p>
                We do not sell your personal browsing habits to third-party ad networks. You may reset or clear cookies at any time through your browser settings.
              </p>
            </div>
          )}

          {tab === 'disclaimer' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Disclaimer</h2>
              <p>
                While Kanha Residency takes all reasonable precautions to maintain optimal service, we are not liable for temple schedule changes, weather delays, or unexpected parikrama route diversions enforced by local district authorities during festive periods like Janmashtami or Holi.
              </p>
              <p>
                Official property location: CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
