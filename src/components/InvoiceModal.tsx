import { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import type { Booking } from '../types';
import { BrandLogo } from './BrandLogo';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = (amt: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-3xl w-full my-8 bg-[#FAF7F2] text-[#121316] rounded-3xl shadow-2xl overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full">
        {/* Header Actions (hidden on print) */}
        <div className="bg-[#141518] px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#E5C79E]">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Official Tax Invoice & Stay Voucher</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#C5A880] text-[#121316] text-xs font-bold hover:bg-[#E5C79E] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#A3998C] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={printRef} className="p-8 sm:p-12 space-y-8 bg-[#FAF7F2]">
          {/* Top Brand Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#121316] pb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-[0.2em] uppercase text-[#121316]">
                Kanha Residency
              </h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8C6E42] font-semibold mt-0.5">
                Mathura · Uttar Pradesh
              </p>
              <p className="text-xs text-[#5A544A] mt-2 max-w-xs">
                CMWM+RJX, Techman Nilgiri, Mathura, UP 281006
                <br />
                GSTIN: 09AABCK1234F1Z8 | Contact: +91 79836 29114
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#121316] text-[#E5C79E] text-[10px] font-bold uppercase tracking-[0.2em] rounded mb-2">
                Booking Voucher
              </span>
              <div className="text-xs text-[#5A544A]">Booking ID:</div>
              <div className="font-mono text-base font-bold text-[#121316]">
                {booking.booking_number}
              </div>
              <div className="text-[11px] text-[#7A7369] mt-1">
                Issued: {new Date(booking.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Guest & Reservation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Guest Details */}
            <div className="p-5 rounded-2xl bg-[#EFE9DF] border border-[#DDD5C7] space-y-1.5">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#121316] mb-2 border-b border-[#DDD5C7] pb-1">
                Guest Information
              </h4>
              <div>
                <span className="text-[#7A7369]">Name:</span>{' '}
                <span className="font-semibold text-[#121316]">{booking.guest?.full_name || 'Guest'}</span>
              </div>
              <div>
                <span className="text-[#7A7369]">Email:</span>{' '}
                <span className="font-medium text-[#121316]">{booking.guest?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#7A7369]">Phone:</span>{' '}
                <span className="font-medium text-[#121316]">{booking.guest?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#7A7369]">Origin:</span>{' '}
                <span className="font-medium text-[#121316]">
                  {booking.guest?.city || booking.guest?.address || 'Mathura, UP'}
                </span>
              </div>
            </div>

            {/* Stay Details */}
            <div className="p-5 rounded-2xl bg-[#EFE9DF] border border-[#DDD5C7] space-y-1.5">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#121316] mb-2 border-b border-[#DDD5C7] pb-1">
                Stay Schedule
              </h4>
              <div>
                <span className="text-[#7A7369]">Reserved Room:</span>{' '}
                <span className="font-bold text-[#121316]">{booking.room_name}</span>
              </div>
              <div>
                <span className="text-[#7A7369]">Check-In:</span>{' '}
                <span className="font-semibold text-[#121316]">
                  {booking.check_in} (from 14:00)
                </span>
              </div>
              <div>
                <span className="text-[#7A7369]">Check-Out:</span>{' '}
                <span className="font-semibold text-[#121316]">
                  {booking.check_out} (until 11:00)
                </span>
              </div>
              <div>
                <span className="text-[#7A7369]">Duration & Occupancy:</span>{' '}
                <span className="font-medium text-[#121316]">
                  {booking.nights} Night(s) · {booking.guests} Guest(s)
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div className="border border-[#DDD5C7] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#121316] text-[#FAF7F2]">
                <tr>
                  <th className="py-3 px-4 text-left uppercase tracking-wider font-semibold">
                    Description
                  </th>
                  <th className="py-3 px-4 text-center uppercase tracking-wider font-semibold">
                    Rate / Night
                  </th>
                  <th className="py-3 px-4 text-center uppercase tracking-wider font-semibold">
                    Nights
                  </th>
                  <th className="py-3 px-4 text-right uppercase tracking-wider font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD5C7] text-[#121316]">
                <tr>
                  <td className="py-3.5 px-4 font-medium">
                    {booking.room_name} Accommodation
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {formattedAmount(Math.round(booking.subtotal / Math.max(1, booking.nights)))}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold">
                    {booking.nights}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">
                    {formattedAmount(booking.subtotal)}
                  </td>
                </tr>

                {booking.discount > 0 && (
                  <tr className="bg-emerald-50 text-emerald-900">
                    <td className="py-3 px-4" colSpan={3}>
                      Promotional Discount Applied
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      -{formattedAmount(booking.discount)}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="py-3 px-4 text-[#7A7369]" colSpan={3}>
                    Hospitality Goods & Services Tax (GST 12%)
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#121316]">
                    {formattedAmount(booking.tax)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-[#EFE9DF] border-t-2 border-[#121316] font-bold text-sm text-[#121316]">
                <tr>
                  <td className="py-4 px-4 uppercase tracking-wider" colSpan={3}>
                    Total Paid
                  </td>
                  <td className="py-4 px-4 text-right font-serif text-lg text-[#121316]">
                    {formattedAmount(booking.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status & Security Hash */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#E8E2D9] border border-[#DDD5C7] text-xs gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[#121316]">
                  Payment Verified
                </span>
                <span className="text-[#5A544A] block">
                  Method: {booking.payment_method} · Txn ID: {booking.payment_id}
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-[#7A7369] font-mono">
              Status: {booking.status.toUpperCase()} · Verified Gateway
            </div>
          </div>

          {/* Policies & Notes */}
          <div className="text-[11px] text-[#7A7369] space-y-1 leading-relaxed border-t border-[#DDD5C7] pt-4">
            <p className="font-semibold text-[#121316]">Arrival Instructions:</p>
            <p>
              • Please present a government-issued photo identity card (Aadhaar, Passport, or Voter ID) during check-in.
            </p>
            <p>
              • Free cancellation is permitted up to 48 hours prior to check-in time (14:00 PM IST).
            </p>
            <p>
              • Pure vegetarian sattvic dining is available upon request from our temple concierge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
