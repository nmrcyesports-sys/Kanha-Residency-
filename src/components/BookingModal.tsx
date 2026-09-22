import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Sparkles,
  Download,
  Printer,
  Compass,
  AlertCircle,
  Clock,
  Mail,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Room, PaymentMethod, EmailLog } from '../types';
import { InvoiceModal } from './InvoiceModal';
import { EmailPreviewModal } from './EmailPreviewModal';

export function BookingModal() {
  const {
    state,
    setDates,
    setGuests,
    selectRoom,
    setGuestInfo,
    setPaymentMethod,
    setPolicyConsent,
    applyCoupon,
    removeCoupon,
    setStep,
    closeBookingModal,
    confirmBookingAndPay,
    resetBooking,
  } = useBooking();

  const { user } = useAuth();

  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResendConfirmationEmail = async () => {
    if (!state.confirmedBooking?.guest?.email) return;
    setResendingEmail(true);
    setResendStatus(null);
    try {
      await api.sendTestEmail(state.confirmedBooking.guest.email, 'Booking Confirmed', {
        guest_name: state.confirmedBooking.guest.full_name,
        booking_id: state.confirmedBooking.booking_number,
        room_name: state.confirmedBooking.room_name,
        total: state.confirmedBooking.total,
        check_in: state.confirmedBooking.check_in,
        check_out: state.confirmedBooking.check_out,
      });
      setResendStatus(`Voucher dispatched to ${state.confirmedBooking.guest.email}`);
    } catch (err: any) {
      setResendStatus(err.message || 'Email dispatch completed');
    } finally {
      setResendingEmail(false);
    }
  };

  // Payment mock states
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Sync logged in user if available
  useEffect(() => {
    if (user && !state.guestName) {
      setGuestInfo({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Load rooms when entering step 2
  useEffect(() => {
    if (state.step === 2) {
      setLoadingRooms(true);
      api.getRooms()
        .then((rooms) => setAvailableRooms(rooms))
        .catch(console.warn)
        .finally(() => setLoadingRooms(false));
    }
  }, [state.step]);

  // Prevent background page from scrolling when modal is open
  useEffect(() => {
    if (state.isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isBookingModalOpen]);

  if (!state.isBookingModalOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
  };

  const handleProcessPayment = async () => {
    setPaying(true);
    setPayError(null);
    try {
      await confirmBookingAndPay();
    } catch (err: any) {
      setPayError(err.message || 'Payment authorization failed. Please retry.');
    } finally {
      setPaying(false);
    }
  };

  const formattedAmount = (amt: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <>
      <AnimatePresence>
        {state.isBookingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-4xl w-full my-6 bg-[#121316] text-[#FAF7F2] rounded-3xl border border-[#3A342B] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
          <div className="bg-[#17181D] px-6 py-4 border-b border-[#2A2621] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] block">
                Reservation Engine
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-[#FAF7F2]">
                {state.step === 1 && 'Select Your Stay Dates'}
                {state.step === 2 && 'Choose Your Suite'}
                {state.step === 3 && 'Guests & Rooms Configuration'}
                {state.step === 4 && 'Guest Details & Preferences'}
                {state.step === 5 && 'Review Reservation & Policies'}
                {state.step === 6 && 'Secure Payment Authorization'}
                {state.step === 7 && 'Reservation Confirmed!'}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {state.step < 7 && (
                <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-[#A3998C]">
                  Step {state.step} of 6
                </span>
              )}
              <button
                onClick={closeBookingModal}
                className="p-1.5 rounded-full text-[#A3998C] hover:text-[#FAF7F2] hover:bg-[#25221D] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {state.step < 7 && (
            <div className="w-full bg-[#1A1B20] h-1">
              <div
                className="bg-gradient-to-r from-[#C5A880] to-[#E5C79E] h-1 transition-all duration-500"
                style={{ width: `${(state.step / 6) * 100}%` }}
              />
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            {/* STEP 1: DATES */}
            {state.step === 1 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <p className="text-xs text-[#A3998C]">
                    Check-in commences at 14:00 PM. Check-out is scheduled by 11:00 AM.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#17181D] border border-[#2D2822]">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#C5A880] mb-2 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Check-In Date</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={state.checkIn}
                      onChange={(e) => {
                        const newIn = e.target.value;
                        let newOut = state.checkOut;
                        if (new Date(newIn) >= new Date(state.checkOut)) {
                          const d = new Date(newIn);
                          d.setDate(d.getDate() + 1);
                          newOut = d.toISOString().split('T')[0];
                        }
                        setDates(newIn, newOut);
                      }}
                      className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880] scheme-dark"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#17181D] border border-[#2D2822]">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#C5A880] mb-2 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Check-Out Date</span>
                    </label>
                    <input
                      type="date"
                      min={state.checkIn || today}
                      value={state.checkOut}
                      onChange={(e) => setDates(state.checkIn, e.target.value)}
                      className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880] scheme-dark"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#16171B] border border-[#25221D] flex items-center justify-between text-xs text-[#E5C79E]">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-[#C5A880]" />
                    <span>Selected Duration:</span>
                  </span>
                  <span className="font-bold text-sm text-[#FAF7F2]">
                    {Math.max(
                      1,
                      Math.round(
                        (new Date(state.checkOut).getTime() - new Date(state.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{' '}
                    Night(s)
                  </span>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Continue to Room Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: ROOM SELECTION */}
            {state.step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#25221D]">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center space-x-1.5 text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dates</span>
                  </button>
                  <span className="text-xs text-[#C5A880]">
                    {state.checkIn} to {state.checkOut}
                  </span>
                </div>

                {loadingRooms ? (
                  <div className="py-16 text-center text-xs text-[#A3998C]">
                    Verifying room inventory & live rates...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {availableRooms.map((room) => {
                      const isSelected = state.selectedRoom?.id === room.id;
                      return (
                        <div
                          key={room.id}
                          className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'bg-[#1D1B17] border-[#C5A880] shadow-lg shadow-[#C5A880]/15'
                              : 'bg-[#15161A] border-[#2D2822] hover:border-[#3E382E]'
                          }`}
                        >
                          <div>
                            <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                              <img
                                src={room.featured_image}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[#121316]/90 backdrop-blur-md text-[11px] font-bold text-[#E5C79E]">
                                {formattedAmount(room.price)} / night
                              </div>
                            </div>

                            <h3 className="font-serif text-xl font-medium text-[#FAF7F2] mb-1">
                              {room.name}
                            </h3>
                            <p className="text-xs text-[#A3998C] line-clamp-2 mb-3">
                              {room.short_description}
                            </p>

                            <div className="flex items-center space-x-4 text-xs text-[#C5A880] mb-4">
                              <span>Max {room.max_guests} Guests</span>
                              <span>•</span>
                              <span>{room.bed_type}</span>
                              <span>•</span>
                              <span>{room.room_size}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => selectRoom(room)}
                            className={`w-full py-2.5 rounded-xl text-xs uppercase font-bold tracking-[0.15em] transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#C5A880] text-[#121316]'
                                : 'border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#121316]'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select This Suite'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: GUESTS & OCCUPANCY */}
            {state.step === 3 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#25221D]">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center space-x-1.5 text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Rooms</span>
                  </button>
                  <span className="text-xs text-[#C5A880] font-medium">
                    {state.selectedRoom?.name}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#17181D] border border-[#2D2822]">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#C5A880] mb-2 flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Number of Guests</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setGuests(n, state.roomsCount)}
                          className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                            state.guests === n
                              ? 'bg-[#C5A880] text-[#121316] border-[#C5A880]'
                              : 'bg-[#1E2028] text-[#FAF7F2] border-[#332E27] hover:border-[#C5A880]'
                          }`}
                        >
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#17181D] border border-[#2D2822]">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#C5A880] mb-2">
                      Number of Rooms
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setGuests(state.guests, r)}
                          className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                            state.roomsCount === r
                              ? 'bg-[#C5A880] text-[#121316] border-[#C5A880]'
                              : 'bg-[#1E2028] text-[#FAF7F2] border-[#332E27] hover:border-[#C5A880]'
                          }`}
                        >
                          {r} {r === 1 ? 'Room' : 'Rooms'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 4: GUEST INFORMATION */}
            {state.step === 4 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#25221D]">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center space-x-1.5 text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs text-[#A3998C]">Guest Profile</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                      Primary Guest Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={state.guestName}
                      onChange={(e) => setGuestInfo({ name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                        Email Address (for Voucher) *
                      </label>
                      <input
                        type="email"
                        required
                        value={state.guestEmail}
                        onChange={(e) => setGuestInfo({ email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                        Mobile Phone (with WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={state.guestPhone}
                        onChange={(e) => setGuestInfo({ phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                        City
                      </label>
                      <input
                        type="text"
                        value={state.guestCity}
                        onChange={(e) => setGuestInfo({ city: e.target.value })}
                        placeholder="e.g. New Delhi"
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                        State
                      </label>
                      <input
                        type="text"
                        value={state.guestState}
                        onChange={(e) => setGuestInfo({ state: e.target.value })}
                        placeholder="e.g. Delhi NCR"
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                      Special Requests / Temple Itinerary
                    </label>
                    <textarea
                      rows={2}
                      value={state.specialRequests}
                      onChange={(e) => setGuestInfo({ specialRequests: e.target.value })}
                      placeholder="e.g. Early check-in request, ground floor room for elders, pure vegetarian breakfast..."
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-4 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <button
                  disabled={!state.guestName || !state.guestEmail || !state.guestPhone}
                  onClick={() => setStep(5)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>Review & Transparency</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 5: REVIEW, COUPON & POLICIES */}
            {state.step === 5 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#25221D]">
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center space-x-1.5 text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs text-[#C5A880] uppercase tracking-wider">
                    Price Transparency
                  </span>
                </div>

                {/* Reservation Summary Card */}
                <div className="rounded-2xl bg-[#16171B] border border-[#2D2822] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-xl text-[#FAF7F2]">
                        {state.selectedRoom?.name}
                      </h4>
                      <p className="text-xs text-[#A3998C]">
                        {state.checkIn} to {state.checkOut} ({state.pricing?.nights || 1} Nights) ·{' '}
                        {state.guests} Guests · {state.roomsCount} Room(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#A3998C]">Nightly Rate</div>
                      <div className="font-serif text-base font-semibold text-[#E5C79E]">
                        {formattedAmount(state.pricing?.nightlyPrice || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Coupon Bar */}
                  <div className="pt-3 border-t border-[#25221D]">
                    {state.couponCode ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs">
                        <div className="flex items-center space-x-2 text-emerald-300">
                          <Sparkles className="w-4 h-4" />
                          <span>Coupon {state.couponCode} applied (-{formattedAmount(state.couponDiscount)})</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-stone-400 hover:text-stone-200 underline text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Coupon Code (e.g. WELCOME10)"
                          className="flex-1 bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] uppercase focus:outline-none focus:border-[#C5A880]"
                        />
                        <button
                          type="submit"
                          disabled={couponLoading}
                          className="px-4 py-2 rounded-xl bg-[#2A2621] text-[#E5C79E] text-xs font-bold hover:bg-[#38332B] transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {state.couponError && (
                      <p className="text-[11px] text-rose-400 mt-1">{state.couponError}</p>
                    )}
                  </div>

                  {/* Breakdown Table */}
                  <div className="pt-3 border-t border-[#25221D] space-y-2 text-xs">
                    <div className="flex justify-between text-[#A3998C]">
                      <span>
                        Base Subtotal ({state.pricing?.nights} Nights ×{' '}
                        {formattedAmount(state.pricing?.nightlyPrice || 0)})
                      </span>
                      <span className="text-[#FAF7F2] font-medium">
                        {formattedAmount(state.pricing?.subtotal || 0)}
                      </span>
                    </div>

                    {state.pricing && state.pricing.discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Promotional Discount</span>
                        <span>-{formattedAmount(state.pricing.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#A3998C]">
                      <span>Hospitality GST (12%)</span>
                      <span className="text-[#FAF7F2] font-medium">
                        {formattedAmount(state.pricing?.tax || 0)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#332E27] flex justify-between items-baseline text-sm">
                      <span className="font-serif text-base text-[#FAF7F2]">Total Payable</span>
                      <span className="font-serif text-2xl font-bold text-[#E5C79E]">
                        {formattedAmount(state.pricing?.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Required Legal Checkboxes */}
                <div className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3 text-xs">
                  <h5 className="font-serif text-sm text-[#FAF7F2]">
                    Policies & Legal Consent
                  </h5>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.policyConsent.terms}
                      onChange={(e) => setPolicyConsent({ terms: e.target.checked })}
                      className="mt-0.5 rounded border-[#3A342B] text-[#C5A880] focus:ring-0 focus:outline-none"
                    />
                    <span className="text-[#B5ABA0]">
                      I accept the{' '}
                      <span className="text-[#C5A880] underline">Terms & Conditions</span> of Kanha
                      Residency, including check-in protocols and property rules.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.policyConsent.cancellation}
                      onChange={(e) => setPolicyConsent({ cancellation: e.target.checked })}
                      className="mt-0.5 rounded border-[#3A342B] text-[#C5A880] focus:ring-0 focus:outline-none"
                    />
                    <span className="text-[#B5ABA0]">
                      I understand the{' '}
                      <span className="text-[#C5A880] underline">Cancellation Policy</span>: full
                      refund available up to 48 hours prior to check-in (14:00 IST).
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.policyConsent.privacy}
                      onChange={(e) => setPolicyConsent({ privacy: e.target.checked })}
                      className="mt-0.5 rounded border-[#3A342B] text-[#C5A880] focus:ring-0 focus:outline-none"
                    />
                    <span className="text-[#B5ABA0]">
                      I consent to the collection of my reservation data under the{' '}
                      <span className="text-[#C5A880] underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <button
                  disabled={
                    !state.policyConsent.terms ||
                    !state.policyConsent.cancellation ||
                    !state.policyConsent.privacy
                  }
                  onClick={() => setStep(6)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 6: PAYMENT GATEWAY */}
            {state.step === 6 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#25221D]">
                  <button
                    onClick={() => setStep(5)}
                    className="flex items-center space-x-1.5 text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <span className="font-serif text-sm text-[#E5C79E]">
                    Pay {formattedAmount(state.pricing?.total || 0)}
                  </span>
                </div>

                {payError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-900 text-xs text-red-200 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'UPI' as PaymentMethod, label: 'UPI / QR', icon: QrCode },
                    { id: 'Cards' as PaymentMethod, label: 'Cards', icon: CreditCard },
                    { id: 'Net Banking' as PaymentMethod, label: 'NetBank', icon: Building },
                    { id: 'Wallets' as PaymentMethod, label: 'Wallets', icon: Wallet },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = state.paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs transition-all ${
                          isSelected
                            ? 'bg-[#25211B] border-[#C5A880] text-[#E5C79E]'
                            : 'bg-[#15161A] border-[#2D2822] text-[#A3998C] hover:border-[#3E382E]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Forms */}
                <div className="p-5 rounded-2xl bg-[#16171B] border border-[#2D2822] space-y-4">
                  {state.paymentMethod === 'UPI' && (
                    <div className="space-y-4 text-center">
                      <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=kanharesidency@hdfcbank&pn=Kanha%20Residency&am=${
                            state.pricing?.total || 3500
                          }&cu=INR`}
                          alt="UPI Payment QR Code"
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs text-[#A3998C]">
                        Scan via Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                          Or enter UPI VPA / ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] text-center focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>
                  )}

                  {state.paymentMethod === 'Cards' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] font-mono focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                            Expiry
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] font-mono focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1 font-medium">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={4}
                            className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] font-mono focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {state.paymentMethod === 'Net Banking' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-2 font-medium">
                        Select Your Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-[#1E2028] border border-[#332E27] rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                      </select>
                    </div>
                  )}

                  {state.paymentMethod === 'Wallets' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {['Paytm Wallet', 'Amazon Pay', 'MobiKwik', 'PhonePe Wallet'].map((w) => (
                        <div
                          key={w}
                          className="p-3 rounded-xl bg-[#1E2028] border border-[#332E27] text-center font-medium text-[#FAF7F2] hover:border-[#C5A880] cursor-pointer"
                        >
                          {w}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] text-[#A3998C]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>256-Bit SSL Encrypted · PCI-DSS Compliant Gateway</span>
                  </div>
                </div>

                <button
                  disabled={paying}
                  onClick={handleProcessPayment}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A880] via-[#DFBF95] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-[#C5A880]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {paying ? 'Verifying Gateway Response...' : `Authorize & Pay ${formattedAmount(state.pricing?.total || 0)}`}
                  </span>
                </button>
              </div>
            )}

            {/* STEP 7: CONFIRMATION */}
            {state.step === 7 && state.confirmedBooking && (
              <div className="space-y-6 max-w-xl mx-auto text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-xl">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A880] block mb-1">
                    Namaste & Welcome
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2]">
                    Your Stay Is Confirmed!
                  </h3>
                  <p className="text-xs text-[#A3998C] mt-2">
                    Confirmation #{state.confirmedBooking.booking_number} has been dispatched to{' '}
                    <span className="text-[#FAF7F2] font-semibold">{state.confirmedBooking.guest?.email}</span>.
                  </p>
                </div>

                {/* Live Email Confirmation & Resend Bar */}
                <div className="p-3.5 rounded-2xl bg-[#161820] border border-[#2D2822] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5 text-left">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div>
                      <p className="text-[#FAF7F2] font-medium">
                        Confirmation & Itinerary Dispatched
                      </p>
                      <p className="text-[11px] text-[#A3998C]">
                        {resendStatus || `Sent to ${state.confirmedBooking.guest?.email}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      disabled={resendingEmail}
                      onClick={handleResendConfirmationEmail}
                      className="px-3 py-1.5 rounded-lg bg-[#202229] border border-[#332E27] text-xs font-semibold text-[#C5A880] hover:text-[#FAF7F2] hover:border-[#C5A880] transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{resendingEmail ? 'Sending...' : 'Resend Email'}</span>
                    </button>
                    <a
                      href={`https://mail.google.com/mail/u/0/#search/Kanha+Residency+${state.confirmedBooking.booking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#202229] border border-[#332E27] text-xs font-semibold text-[#D8CFBF] hover:text-[#FAF7F2] transition-colors"
                    >
                      Open Gmail
                    </a>
                  </div>
                </div>

                {/* Booking Summary Box */}
                <div className="rounded-2xl bg-[#16171B] border border-[#2D2822] p-5 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-[#25221D] pb-2">
                    <span className="text-[#A3998C]">Room:</span>
                    <span className="font-serif font-medium text-[#FAF7F2]">
                      {state.confirmedBooking.room_name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#25221D] pb-2">
                    <span className="text-[#A3998C]">Dates:</span>
                    <span className="text-[#FAF7F2]">
                      {state.confirmedBooking.check_in} → {state.confirmedBooking.check_out} (
                      {state.confirmedBooking.nights} Nights)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#25221D] pb-2">
                    <span className="text-[#A3998C]">Total Paid:</span>
                    <span className="font-serif font-bold text-[#E5C79E]">
                      {formattedAmount(state.confirmedBooking.total)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-[11px]">
                    <span className="text-[#A3998C]">Txn ID:</span>
                    <span className="font-mono text-[#7A7369]">
                      {state.confirmedBooking.payment_id}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="flex-1 py-3 rounded-full bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#E5C79E] transition-all cursor-pointer luxury-btn-hover"
                  >
                    <Download className="w-4 h-4" />
                    <span>View / Print Invoice</span>
                  </button>

                  <button
                    onClick={() => setShowEmailPreview(true)}
                    className="flex-1 py-3 rounded-full bg-[#1B1D23] border border-[#C5A880]/50 text-[#E5C79E] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#252832] hover:border-[#C5A880] transition-all cursor-pointer luxury-btn-hover"
                  >
                    <Mail className="w-4 h-4 text-[#C5A880]" />
                    <span>View Dispatched Email</span>
                  </button>

                  <a
                    href="https://www.google.com/maps/dir/23.7811896,86.408605/Kanha+Residency,+CMWM%2BRJX,+Techman+Nilgiri,+Mathura,+Uttar+Pradesh+281006/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-full border border-[#3A342B] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#FAF7F2]/10 transition-colors luxury-pill-hover"
                  >
                    <Compass className="w-4 h-4 text-[#C5A880]" />
                    <span>Directions</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      resetBooking();
                      closeBookingModal();
                    }}
                    className="text-xs text-[#A3998C] hover:text-[#FAF7F2] underline cursor-pointer"
                  >
                    Done & Return to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>

      {/* Invoice Modal */}
      {showInvoice && state.confirmedBooking && (
        <InvoiceModal
          booking={state.confirmedBooking}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Auto Email Preview Modal */}
      {showEmailPreview && state.confirmedBooking && (
        <EmailPreviewModal
          isOpen={showEmailPreview}
          onClose={() => setShowEmailPreview(false)}
          bookingNumber={state.confirmedBooking.booking_number}
          guestName={state.confirmedBooking.guest?.full_name}
          email={{
            id: `eml_${state.confirmedBooking.id}`,
            recipient: state.confirmedBooking.guest?.email || '',
            subject: `Confirmed: Your Stay at Kanha Residency (ID: ${state.confirmedBooking.booking_number})`,
            template_name: 'Booking Confirmed',
            status: 'Sent',
            sent_time: new Date().toISOString(),
            related_booking: state.confirmedBooking.booking_number,
            body: `Namaste ${state.confirmedBooking.guest?.full_name || 'Valued Guest'},

We are delighted to confirm your bespoke reservation at Kanha Residency, Mathura.

RESERVATION OVERVIEW:
• Booking Reference: ${state.confirmedBooking.booking_number}
• Reserved Suite: ${state.confirmedBooking.room_name}
• Check-in: ${state.confirmedBooking.check_in} (from 14:00 hrs)
• Check-out: ${state.confirmedBooking.check_out} (until 11:00 hrs)
• Duration: ${state.confirmedBooking.nights} Night(s)
• Total Guests: ${state.confirmedBooking.guests} Guest(s)
• Total Paid: ₹${state.confirmedBooking.total} (Including GST 12%)
• Transaction ID: ${state.confirmedBooking.payment_id}

PILGRIMAGE CONCIERGE & LOCAL GUIDANCE:
• Shri Krishna Janmabhoomi: 10 mins (Morning Mangala Aarti: 05:30 AM)
• Dwarkadhish Temple & Vishram Ghat: Evening Yamuna Aarti at 07:00 PM
• Govardhan Parikrama: Pre-arranged private transport available upon request

PROPERTY ADDRESS:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006
Concierge Desk: +91 98970 12345 | reservations@kanharesidency.com

Warm regards & Jai Shri Krishna,
Kanha Residency Hospitality Team`,
          }}
        />
      )}
    </>
  );
}
