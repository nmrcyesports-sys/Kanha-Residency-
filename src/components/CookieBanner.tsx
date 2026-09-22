import { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';

export function CookieBanner({ onOpenPolicy }: { onOpenPolicy: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kr_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kr_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kr_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-500">
      <div className="rounded-2xl bg-[#141518]/95 backdrop-blur-xl border border-[#3A342B] p-5 shadow-2xl shadow-black/80 text-[#FAF7F2]">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-[#1E2028] text-[#C5A880] shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif text-sm font-semibold text-[#FAF7F2]">
              Privacy & Cookie Preferences
            </h4>
            <p className="text-xs text-[#A3998C] mt-1 leading-relaxed">
              Kanha Residency uses essential cookies to process reservations, ensure security, and enhance your digital stay experience.{' '}
              <button
                onClick={onOpenPolicy}
                className="text-[#C5A880] underline hover:text-[#FAF7F2]"
              >
                Learn more
              </button>
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="text-[#8C8377] hover:text-[#FAF7F2] p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#25221D] flex items-center justify-end space-x-3">
          <button
            onClick={handleDecline}
            className="px-3.5 py-1.5 rounded-lg border border-[#332E27] text-xs text-[#A3998C] hover:text-[#FAF7F2]"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#121316] text-xs font-bold uppercase tracking-wider hover:bg-[#E5C79E]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
