import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { api } from '../services/api';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.submitEnquiry({
        name,
        email,
        phone,
        message,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#0D0E10] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & Heritage Concierge */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
                Connect With Us
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#FAF7F2]">
                Our Concierge Awaits
              </h2>
            </div>

            <p className="text-sm text-[#B5ABA0] leading-relaxed font-light">
              Whether you are planning a spiritual parikrama with family, seeking special accommodation arrangements for elders, or inquiring about group stays, our dedicated team is at your service 24/7.
            </p>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#141518] border border-[#2D2822]">
                <div className="p-2.5 rounded-xl bg-[#1B1D23] text-[#C5A880]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                    Reservations & Front Desk
                  </div>
                  <a
                    href="tel:+917983629114"
                    className="text-sm font-medium text-[#FAF7F2] hover:text-[#C5A880] transition-colors block mt-0.5"
                  >
                    +91 79836 29114
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="text-xs text-[#A3998C] hover:text-[#C5A880] transition-colors block"
                  >
                    +91 98765 43210 (Concierge Desk)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#141518] border border-[#2D2822]">
                <div className="p-2.5 rounded-xl bg-[#1B1D23] text-[#C5A880]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                    Electronic Correspondence
                  </div>
                  <a
                    href="mailto:reservations@kanharesidency.com"
                    className="text-sm font-medium text-[#FAF7F2] hover:text-[#C5A880] transition-colors block mt-0.5"
                  >
                    reservations@kanharesidency.com
                  </a>
                  <a
                    href="mailto:concierge@kanharesidency.com"
                    className="text-xs text-[#A3998C] hover:text-[#C5A880] transition-colors block"
                  >
                    concierge@kanharesidency.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#141518] border border-[#2D2822]">
                <div className="p-2.5 rounded-xl bg-[#1B1D23] text-[#C5A880]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                    Location
                  </div>
                  <p className="text-xs text-[#FAF7F2] mt-0.5 leading-relaxed">
                    CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center space-x-3 text-xs text-[#A3998C] px-2">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span>Check-in: 14:00 PM · Check-out: 11:00 AM · Front Desk: 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#141518] border border-[#332E27] p-8 sm:p-12 shadow-2xl relative">
              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center animate-in fade-in duration-500">
                  <CheckCircle2 className="w-16 h-16 text-[#C5A880] mb-4" />
                  <h3 className="font-serif text-3xl text-[#FAF7F2] mb-2">
                    Enquiry Received
                  </h3>
                  <p className="text-sm text-[#A3998C] max-w-md mx-auto mb-6 leading-relaxed">
                    Namaste. Our reservation desk has received your request. A member of our concierge team will reach out to you via email/phone within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-[#C5A880] text-[#C5A880] text-xs uppercase font-bold tracking-wider hover:bg-[#C5A880] hover:text-[#121316] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#25221D] pb-4">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880] block mb-1">
                      Direct Messaging
                    </span>
                    <h3 className="font-serif text-2xl text-[#FAF7F2]">
                      Send Us an Enquiry
                    </h3>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-950/50 border border-red-900 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1.5 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#6E675D] focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1.5 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#6E675D] focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1.5 font-medium">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#6E675D] focus:outline-none focus:border-[#C5A880] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1.5 font-medium">
                      Message / Special Query *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your planned travel dates, number of guests, temple itinerary assistance, or dietary requirements..."
                      className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#6E675D] focus:outline-none focus:border-[#C5A880] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A880] via-[#DFBF95] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.25em] shadow-lg shadow-[#C5A880]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting...' : 'Send Message to Concierge'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
