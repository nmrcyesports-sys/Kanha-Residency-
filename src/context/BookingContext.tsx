import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Room, Booking, PaymentMethod, PolicyConsent } from '../types';
import { api } from '../services/api';

export interface BookingState {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomsCount: number;
  selectedRoom: Room | null;
  couponCode: string;
  couponDiscount: number;
  couponError?: string;
  specialRequests: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  guestCity: string;
  guestState: string;
  guestCountry: string;
  paymentMethod: PaymentMethod;
  policyConsent: PolicyConsent;
  step: number; // 1: Dates, 2: Room, 3: Guests, 4: Guest Info, 5: Review & Consent, 6: Payment, 7: Confirmed
  isBookingModalOpen: boolean;
  pricing: {
    nightlyPrice: number;
    nights: number;
    subtotal: number;
    discount: number;
    taxRatePercentage: number;
    tax: number;
    total: number;
  } | null;
  confirmedBooking: Booking | null;
}

interface BookingContextType {
  state: BookingState;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: number, roomsCount?: number) => void;
  selectRoom: (room: Room) => void;
  setGuestInfo: (info: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    specialRequests: string;
  }>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPolicyConsent: (consent: Partial<PolicyConsent>) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setStep: (step: number) => void;
  openBookingModal: (room?: Room, initialDates?: { checkIn: string; checkOut: string }) => void;
  closeBookingModal: () => void;
  recalculatePricing: () => Promise<void>;
  confirmBookingAndPay: () => Promise<Booking>;
  resetBooking: () => void;
}

// Generate default checkIn (tomorrow) and checkOut (3 days later)
function getDefaultDates() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const checkIn = d.toISOString().split('T')[0];
  d.setDate(d.getDate() + 2);
  const checkOut = d.toISOString().split('T')[0];
  return { checkIn, checkOut };
}

const defaultDates = getDefaultDates();

const initialBookingState: BookingState = {
  checkIn: defaultDates.checkIn,
  checkOut: defaultDates.checkOut,
  guests: 2,
  roomsCount: 1,
  selectedRoom: null,
  couponCode: '',
  couponDiscount: 0,
  specialRequests: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  guestAddress: '',
  guestCity: 'Mathura',
  guestState: 'Uttar Pradesh',
  guestCountry: 'India',
  paymentMethod: 'UPI',
  policyConsent: {
    terms: false,
    cancellation: false,
    privacy: false,
    timestamp: '',
    version: 'v1.0-2026',
  },
  step: 1,
  isBookingModalOpen: false,
  pricing: null,
  confirmedBooking: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialBookingState);

  const recalculatePricing = async () => {
    if (!state.selectedRoom) return;
    try {
      const p = await api.calculatePricing(
        state.selectedRoom.id,
        state.checkIn,
        state.checkOut,
        state.couponCode || undefined
      );
      setState((prev) => ({
        ...prev,
        pricing: p,
        couponDiscount: p.discount,
      }));
    } catch (err: any) {
      console.warn('Pricing calc error:', err);
    }
  };

  useEffect(() => {
    if (state.selectedRoom && state.checkIn && state.checkOut) {
      recalculatePricing();
    }
  }, [state.selectedRoom, state.checkIn, state.checkOut, state.couponCode]);

  const setDates = (checkIn: string, checkOut: string) => {
    setState((prev) => ({ ...prev, checkIn, checkOut }));
  };

  const setGuests = (guests: number, roomsCount = 1) => {
    setState((prev) => ({ ...prev, guests, roomsCount }));
  };

  const selectRoom = (room: Room) => {
    setState((prev) => ({
      ...prev,
      selectedRoom: room,
      step: 3, // proceed to guests
    }));
  };

  const setGuestInfo = (info: any) => {
    setState((prev) => ({
      ...prev,
      guestName: info.name !== undefined ? info.name : prev.guestName,
      guestEmail: info.email !== undefined ? info.email : prev.guestEmail,
      guestPhone: info.phone !== undefined ? info.phone : prev.guestPhone,
      guestAddress: info.address !== undefined ? info.address : prev.guestAddress,
      guestCity: info.city !== undefined ? info.city : prev.guestCity,
      guestState: info.state !== undefined ? info.state : prev.guestState,
      guestCountry: info.country !== undefined ? info.country : prev.guestCountry,
      specialRequests: info.specialRequests !== undefined ? info.specialRequests : prev.specialRequests,
    }));
  };

  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod }));
  };

  const setPolicyConsent = (consent: Partial<PolicyConsent>) => {
    setState((prev) => ({
      ...prev,
      policyConsent: {
        ...prev.policyConsent,
        ...consent,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  const applyCoupon = async (code: string) => {
    if (!state.pricing) return false;
    const res = await api.validateCoupon(code, state.pricing.subtotal);
    if (res.valid && res.coupon) {
      setState((prev) => ({
        ...prev,
        couponCode: code.toUpperCase(),
        couponError: undefined,
      }));
      return true;
    } else {
      setState((prev) => ({
        ...prev,
        couponError: res.message || 'Invalid coupon code',
      }));
      return false;
    }
  };

  const removeCoupon = () => {
    setState((prev) => ({
      ...prev,
      couponCode: '',
      couponDiscount: 0,
      couponError: undefined,
    }));
  };

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const openBookingModal = (room?: Room, initialDates?: { checkIn: string; checkOut: string }) => {
    setState((prev) => ({
      ...prev,
      isBookingModalOpen: true,
      selectedRoom: room || prev.selectedRoom,
      checkIn: initialDates ? initialDates.checkIn : prev.checkIn,
      checkOut: initialDates ? initialDates.checkOut : prev.checkOut,
      step: room ? 3 : 1,
    }));
  };

  const closeBookingModal = () => {
    setState((prev) => ({ ...prev, isBookingModalOpen: false }));
  };

  const confirmBookingAndPay = async (): Promise<Booking> => {
    if (!state.selectedRoom) throw new Error('No room selected');
    if (!state.policyConsent.terms || !state.policyConsent.cancellation || !state.policyConsent.privacy) {
      throw new Error('Please accept the required terms and policies to proceed.');
    }

    const payload = {
      roomId: state.selectedRoom.id,
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      guests: state.guests,
      roomsCount: state.roomsCount,
      couponCode: state.couponCode || undefined,
      specialRequest: state.specialRequests,
      policyConsent: state.policyConsent,
      guest: {
        full_name: state.guestName,
        email: state.guestEmail,
        phone: state.guestPhone,
        address: state.guestAddress,
        city: state.guestCity,
        state: state.guestState,
        country: state.guestCountry,
        special_requests: state.specialRequests,
      },
      paymentMethod: state.paymentMethod,
    };

    const booking = await api.createBooking(payload);
    setState((prev) => ({
      ...prev,
      confirmedBooking: booking,
      step: 7, // Confirmation step
    }));
    return booking;
  };

  const resetBooking = () => {
    setState({
      ...initialBookingState,
      ...getDefaultDates(),
    });
  };

  return (
    <BookingContext.Provider
      value={{
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
        openBookingModal,
        closeBookingModal,
        recalculatePricing,
        confirmBookingAndPay,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
