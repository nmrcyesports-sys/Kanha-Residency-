import { useState } from 'react';
import { ContactSection } from '../components/ContactSection';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are the check-in and check-out timings at Kanha Residency?',
      a: 'Standard check-in is from 14:00 PM onwards, and check-out is by 11:00 AM. Early check-in or late check-out is subject to availability and can be requested via our front desk.',
    },
    {
      q: 'How far is Kanha Residency from Shri Krishna Janmabhoomi?',
      a: 'We are situated approximately 2.4 km (an 8-minute drive) from the Shri Krishna Janmasthan temple complex.',
    },
    {
      q: 'Is pure vegetarian (Sattvic) food available?',
      a: 'Yes, 100% pure vegetarian cuisine prepared with the highest hygiene standards is served. We also cater to onion-garlic-free (jain/sattvic) meals and fasting thalis upon advance intimation.',
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer free cancellation up to 48 hours prior to check-in. Cancellations made within 48 hours will incur a 1-night charge.',
    },
    {
      q: 'Do you arrange temple darshan and taxi services?',
      a: 'Yes, our 24/7 Darshan Desk assists with VIP darshan queue guidelines, private chauffeur bookings for Vrindavan, Govardhan, and Barsana, as well as English/Hindi speaking Braj guides.',
    },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#0D0E10] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
          Assistance & Inquiries
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2] mb-3">
          Contact Concierge
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998C] font-light max-w-xl mx-auto leading-relaxed">
          Reach our dedicated reservation desk in Mathura for inquiries, spiritual pilgrimage guidance, and customized stay arrangements.
        </p>
      </div>

      <ContactSection />

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Common Queries</span>
          </div>
          <h3 className="font-serif text-3xl text-[#FAF7F2]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#141518] border border-[#2D2822] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between hover:text-[#C5A880] transition-colors"
                >
                  <span className="font-serif text-base font-medium text-[#FAF7F2]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C5A880] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A3998C] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#B5ABA0] font-light leading-relaxed border-t border-[#25221D] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
