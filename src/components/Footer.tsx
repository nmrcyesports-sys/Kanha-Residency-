import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#08090B] text-[#FAF7F2] border-t border-[#23201C] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#23201C]">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col items-start text-left">
              <BrandLogo size="md" showTagline />
            </div>
            <p className="text-xs text-[#9E9486] font-light leading-relaxed max-w-sm">
              A serene haven in the sacred city of Mathura. Experience refined hospitality, peaceful accommodations, and authentic Braj grace.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#C5A880]">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span>Government Registered & ISO Certified Hospitality</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.25em] text-[#E5C79E]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3998C]">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/rooms')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Suites & Rooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/experience')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  The Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gallery')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/location')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Location & Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guest & Legal */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.25em] text-[#E5C79E]">
              Guest & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3998C]">
              <li>
                <button
                  onClick={() => onNavigate('/account')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Guest Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/cancellation')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/cookies')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-[#C5A880] transition-colors inline-flex items-center space-x-1"
                >
                  <Shield className="w-3 h-3 text-[#C5A880]" />
                  <span>Admin Access</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Contact */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-xs uppercase font-bold tracking-[0.25em] text-[#E5C79E]">
              Stay Connected
            </h4>
            <p className="text-xs text-[#A3998C] font-light leading-relaxed">
              Subscribe to receive exclusive seasonal offers, festival darshan schedules, and priority suite booking privileges.
            </p>

            {newsletterSubscribed ? (
              <div className="flex items-center space-x-2 text-xs text-[#C5A880] bg-[#16171B] p-3 rounded-xl border border-[#2D2822]">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to Kanha Residency privileges.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-[#141518] border border-[#2D2822] rounded-full px-4 py-2.5 text-xs text-[#FAF7F2] placeholder-[#6E675D] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-[#C5A880] text-[#121316] hover:bg-[#E5C79E] transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-2 text-xs text-[#8C8377] space-y-1">
              <div>24/7 Helpline: +91 79836 29114</div>
              <div>reservations@kanharesidency.com</div>
              <div>Techman Nilgiri, Mathura, UP 281006</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E675D] gap-4">
          <p>© {new Date().getFullYear()} Kanha Residency Mathura. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('/terms')} className="hover:text-[#A3998C]">
              Terms
            </button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-[#A3998C]">
              Privacy
            </button>
            <button onClick={() => onNavigate('/cancellation')} className="hover:text-[#A3998C]">
              Refunds
            </button>
            <span className="text-[#C5A880]/60">Braj Sanctum Collection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
