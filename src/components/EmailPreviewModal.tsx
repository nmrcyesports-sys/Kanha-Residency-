import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, CheckCircle2, Copy, Check, Printer, 
  MapPin, Phone, Calendar, Clock, ShieldCheck, Sparkles, QrCode
} from 'lucide-react';
import { EmailLog } from '../types';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: EmailLog | null;
  guestName?: string;
  bookingNumber?: string;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  email,
  guestName = 'Valued Guest',
  bookingNumber,
}: EmailPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');

  if (!isOpen || !email) return null;

  const handleCopy = () => {
    const textToCopy = `Subject: ${email.subject}\nRecipient: ${email.recipient}\nDate: ${new Date(email.sent_time).toLocaleString('en-IN')}\n\n${email.body || email.subject}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const refNumber = email.related_booking || bookingNumber || 'KR2026-CONF';
  const hasHtml = Boolean(email.html);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#141518] border border-[#2A2621] rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        >
          {/* Top Mail Client Ribbon */}
          <div className="bg-[#0D0E10] px-5 sm:px-6 py-3.5 border-b border-[#2A2621] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#E5C79E]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">Automated Dispatch</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered & Verified
                  </span>
                </div>
                <p className="text-xs text-[#9E988F] mt-0.5 truncate max-w-md">
                  To: <span className="text-white font-medium">{email.recipient}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {hasHtml && (
                <div className="flex rounded-lg bg-[#181A20] p-0.5 border border-[#2A2621] text-xs">
                  <button
                    onClick={() => setViewMode('html')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      viewMode === 'html'
                        ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                        : 'text-[#8E867B] hover:text-[#FAF7F2]'
                    }`}
                  >
                    HTML Voucher
                  </button>
                  <button
                    onClick={() => setViewMode('text')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      viewMode === 'text'
                        ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                        : 'text-[#8E867B] hover:text-[#FAF7F2]'
                    }`}
                  >
                    Plain Text
                  </button>
                </div>
              )}
              <button
                onClick={handleCopy}
                id="copy-email-btn"
                className="p-2 rounded-lg bg-[#1A1C20] hover:bg-[#252830] text-[#C5A880] transition-colors flex items-center space-x-1.5 text-xs border border-[#2A2621]"
                title="Copy email text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrint}
                id="print-email-btn"
                className="p-2 rounded-lg bg-[#1A1C20] hover:bg-[#252830] text-[#9E988F] hover:text-white transition-colors text-xs border border-[#2A2621]"
                title="Print email"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                id="close-email-modal-btn"
                className="p-2 rounded-lg bg-[#1A1C20] hover:bg-[#252830] text-[#9E988F] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Email Metadata Details */}
          <div className="bg-[#101114] px-5 sm:px-6 py-2.5 border-b border-[#1E2024] text-xs space-y-1 shrink-0">
            <div className="flex flex-wrap items-center justify-between text-[#8E8880]">
              <div>
                <span className="text-[#6B655B]">From:</span>{' '}
                <span className="text-white">Kanha Residency Mathura &lt;aurateqmarket@gmail.com&gt;</span>
              </div>
              <div className="flex items-center space-x-1 text-[#6B655B]">
                <Clock className="w-3 h-3" />
                <span>{new Date(email.sent_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
            <div className="text-white font-medium text-sm pt-0.5 flex items-center justify-between">
              <span>{email.subject}</span>
              {email.related_booking && (
                <span className="text-[11px] font-mono text-[#E5C79E] bg-[#C5A880]/10 px-2 py-0.5 rounded border border-[#C5A880]/20">
                  REF: {email.related_booking}
                </span>
              )}
            </div>
          </div>

          {/* Rendered Email Body or Sandboxed HTML */}
          <div className="flex-1 overflow-y-auto bg-[#0B0C0E]">
            {viewMode === 'html' && email.html ? (
              <div className="w-full flex justify-center p-2 sm:p-4">
                <iframe
                  title="Rendered Email HTML Voucher"
                  srcDoc={email.html}
                  className="w-full max-w-[700px] h-[650px] rounded-xl border border-[#2D2720] shadow-xl bg-[#0B0C0E]"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                />
              </div>
            ) : (
              <div className="p-6 space-y-6 bg-gradient-to-b from-[#141518] to-[#0F1012]">
                {/* Branded Header */}
                <div className="text-center pb-6 border-b border-[#2A2621]/80">
                  <div className="inline-flex items-center justify-center space-x-2 text-[#E5C79E] mb-2">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880]">Sacred Braj Hospitality</span>
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <h2 className="text-2xl font-serif text-white tracking-wide">KANHA RESIDENCY</h2>
                  <p className="text-xs text-[#9E988F] font-sans mt-0.5 tracking-wider">MATHURA • UTTAR PRADESH</p>
                </div>

                {/* Email Body Text */}
                <div className="bg-[#181A1F] border border-[#2A2621] rounded-xl p-5 shadow-inner">
                  <div className="text-sm text-[#DDD6CB] leading-relaxed whitespace-pre-wrap font-mono text-xs">
                    {email.body || `Namaste ${guestName},\n\nYour reservation ${refNumber} has been recorded in our reservation management system.`}
                  </div>
                </div>

                {/* Quick Digital Check-in Pass Box */}
                <div className="bg-gradient-to-r from-[#191612] to-[#1F1B16] border border-[#C5A880]/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#E5C79E] uppercase tracking-wider flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#C5A880]" /> Express Digital Check-in
                      </div>
                      <p className="text-xs text-[#9E988F] mt-0.5">
                        Show this QR or booking ID <span className="text-white font-mono">{refNumber}</span> at reception for rapid key dispatch.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Concierge & Location Footer Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3.5 bg-[#121316] border border-[#22242A] rounded-xl flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Property Coordinates</div>
                      <p className="text-[#8E8880] mt-0.5 leading-snug">
                        Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, UP 281006
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#121316] border border-[#22242A] rounded-xl flex items-start space-x-2.5">
                    <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">24/7 Pilgrimage Concierge</div>
                      <p className="text-[#8E8880] mt-0.5 leading-snug">
                        +91 98970 12345 / reservations@kanharesidency.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-[#0D0E10] px-6 py-4 border-t border-[#2A2621] flex items-center justify-between text-xs text-[#7A756D]">
            <span>System Timestamp: {new Date().toLocaleTimeString('en-IN')}</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C79E] text-black font-semibold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-[#C5A880]/10"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
