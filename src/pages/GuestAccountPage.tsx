import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Booking, EmailLog } from '../types';
import {
  Calendar,
  Clock,
  Download,
  Printer,
  Shield,
  User as UserIcon,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Eye,
  Send,
} from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmailPreviewModal } from '../components/EmailPreviewModal';

interface GuestAccountPageProps {
  onNavigate: (path: string) => void;
}

export function GuestAccountPage({ onNavigate }: GuestAccountPageProps) {
  const { user, logout, isAdmin, isManager } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [userEmails, setUserEmails] = useState<EmailLog[]>([]);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      onNavigate('/login');
      return;
    }
    setProfileName(user.name || '');
    setProfilePhone(user.phone || '');
    setProfileAddress(user.address || '');

    api.getUserBookings()
      .then(setBookings)
      .catch(console.warn)
      .finally(() => setLoading(false));

    api.getEmailLogs({ recipient: user.email })
      .then(setUserEmails)
      .catch(console.warn);
  }, [user]);

  if (!user) return null;

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const updated = await api.cancelBooking(cancelModalBooking.id, cancelReason);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setCancelModalBooking(null);
      setCancelReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const formattedAmount = (amt: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="bg-[#0D0E10] text-[#FAF7F2] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#25221D] gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#1F2026] border border-[#3A342B] flex items-center justify-center text-[#C5A880]">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880] block">
                  {user.role} Portal
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2]">
                  Welcome back, {user.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {(isAdmin || isManager) && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-4 py-2 rounded-full border border-[#C5A880] text-[#C5A880] text-xs uppercase font-bold tracking-wider hover:bg-[#C5A880] hover:text-[#121316] transition-all flex items-center space-x-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                onNavigate('/');
              }}
              className="px-4 py-2 rounded-full bg-[#18191E] border border-[#2D2822] text-xs text-[#A3998C] hover:text-rose-400 hover:border-rose-900 transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Bookings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
              <h2 className="font-serif text-2xl text-[#FAF7F2] flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#C5A880]" />
                <span>Your Reservations</span>
              </h2>
              <span className="text-xs text-[#A3998C]">{bookings.length} Total</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-[#A3998C]">
                Loading your reservations...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-[#141518] border border-[#2D2822] p-8 space-y-4">
                <FileText className="w-12 h-12 text-[#3D372E] mx-auto" />
                <h3 className="font-serif text-xl text-[#FAF7F2]">No Active Bookings</h3>
                <p className="text-xs text-[#A3998C] max-w-sm mx-auto">
                  You do not have any room reservations with us yet. Explore our bespoke suites and reserve your Mathura sanctuary.
                </p>
                <button
                  onClick={() => onNavigate('/rooms')}
                  className="px-6 py-2.5 rounded-full bg-[#C5A880] text-[#121316] text-xs uppercase font-bold tracking-wider hover:bg-[#E5C79E]"
                >
                  Explore Suites
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-[#141518] border border-[#2D2822] p-5 sm:p-6 space-y-4 hover:border-[#3E382E] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#25221D] pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                          Booking #{booking.booking_number}
                        </span>
                        <h4 className="font-serif text-xl font-medium text-[#FAF7F2]">
                          {booking.room_name}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                              : booking.status === 'Cancelled'
                              ? 'bg-rose-950/70 border border-rose-800 text-rose-400'
                              : 'bg-stone-900 border border-stone-700 text-stone-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-[10px] text-[#A3998C] uppercase">Check-In</div>
                        <div className="font-medium text-[#FAF7F2]">{booking.check_in}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#A3998C] uppercase">Check-Out</div>
                        <div className="font-medium text-[#FAF7F2]">{booking.check_out}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#A3998C] uppercase">Duration</div>
                        <div className="font-medium text-[#FAF7F2]">
                          {booking.nights} Night(s) · {booking.guests} Guests
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#A3998C] uppercase">Total Paid</div>
                        <div className="font-serif font-bold text-base text-[#E5C79E]">
                          {formattedAmount(booking.total)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#25221D]">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceBooking(booking)}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B1D23] border border-[#332E27] text-xs text-[#FAF7F2] hover:border-[#C5A880] transition-colors cursor-pointer luxury-btn-hover"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Tax Invoice / Voucher</span>
                        </button>

                        <button
                          onClick={() => {
                            const found = userEmails.find((e) => e.related_booking === booking.booking_number);
                            if (found) {
                              setSelectedEmail(found);
                            } else {
                              setSelectedEmail({
                                id: `eml_${booking.id}`,
                                recipient: user.email,
                                subject: `Confirmed: Your Stay at Kanha Residency (ID: ${booking.booking_number})`,
                                template_name: 'Booking Confirmed',
                                status: 'Sent',
                                sent_time: booking.created_at,
                                related_booking: booking.booking_number,
                                body: `Namaste ${user.name},

We are honored to confirm your bespoke reservation at Kanha Residency, Mathura.

RESERVATION DETAILS:
• Booking Reference: ${booking.booking_number}
• Reserved Suite: ${booking.room_name}
• Check-in: ${booking.check_in} (from 14:00 hrs)
• Check-out: ${booking.check_out} (until 11:00 hrs)
• Stay Duration: ${booking.nights} Night(s)
• Total Guests: ${booking.guests} Guest(s)
• Total Paid: ₹${booking.total} (Including GST 12%)
• Transaction ID: ${booking.payment_id}

PILGRIMAGE CONCIERGE & LOCAL GUIDANCE:
• Shri Krishna Janmabhoomi: 10 mins (Morning Mangala Aarti: 05:30 AM)
• Dwarkadhish Temple & Vishram Ghat: Evening Yamuna Aarti at 07:00 PM
• Govardhan Parikrama: Pre-arranged private transport available upon request

PROPERTY ADDRESS:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006
Concierge Desk: +91 98970 12345 | reservations@kanharesidency.com

Warm regards & Jai Shri Krishna,
Kanha Residency Hospitality Team`,
                              });
                            }
                          }}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B1D23] border border-[#332E27] text-xs text-[#E5C79E] hover:border-[#C5A880] transition-colors cursor-pointer luxury-btn-hover"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>View Auto-Email</span>
                        </button>
                      </div>

                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="text-xs text-stone-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Profile, Automated Emails & Privileges */}
          <div className="lg:col-span-4 space-y-6">
            {/* Automated Emails Box - WHERE AUTO EMAIL IS DISPLAYED */}
            <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-4 luxury-card-hover">
              <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#C5A880]" />
                  <h3 className="font-serif text-lg text-[#FAF7F2]">Automated Emails</h3>
                </div>
                <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider font-bold">
                  SMTP Live
                </span>
              </div>

              <p className="text-xs text-[#A3998C] leading-relaxed">
                All booking confirmations, cancellation receipts, and concierge guides are automatically generated and dispatched to <span className="text-[#FAF7F2] font-semibold">{user.email}</span>.
              </p>

              {userEmails.length === 0 ? (
                <div className="text-center py-4 bg-[#1B1D23]/60 rounded-xl border border-[#2D2822] text-xs text-[#7A7369]">
                  No emails logged yet for this account.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {userEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className="p-3 rounded-xl bg-[#1B1D23] border border-[#2D2822] hover:border-[#C5A880]/60 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A3998C] mb-1">
                        <span className="font-semibold text-[#E5C79E]">{email.template_name}</span>
                        <span>{new Date(email.sent_time).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-[#FAF7F2] font-medium truncate group-hover:text-[#C5A880] transition-colors">
                        {email.subject}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#25221D] text-[10px]">
                        <span className="text-[#A3998C]">Booking #{email.related_booking}</span>
                        <span className="text-[#C5A880] flex items-center space-x-1 group-hover:underline">
                          <Eye className="w-3 h-3" />
                          <span>View Full Email</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-5 luxury-card-hover">
              <h3 className="font-serif text-xl text-[#FAF7F2] pb-3 border-b border-[#25221D]">
                Guest Profile
              </h3>

              {profileSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A3998C] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2] focus:outline-none focus:border-[#C5A880] luxury-gold-glow"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A3998C] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#17181D] border border-[#25221D] rounded-xl px-3 py-2 text-[#7A7369] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A3998C] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A3998C] mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C79E] transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* In-House Privileges */}
            <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-3 text-xs text-[#A3998C]">
              <h4 className="font-serif text-base text-[#FAF7F2]">In-House Privileges</h4>
              <p>• 10% privilege discount on all direct repeat bookings.</p>
              <p>• Complimentary early baggage drop at Mathura Front Desk.</p>
              <p>• Priority allotment for evening Yamuna boat bookings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#141518] border border-rose-900/60 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-xl">Cancel Reservation?</h3>
            </div>

            <p className="text-xs text-[#B5ABA0] leading-relaxed">
              Are you sure you want to cancel booking #{cancelModalBooking.booking_number} for{' '}
              {cancelModalBooking.room_name}? According to the policy, full refunds are issued if cancelled 48 hours prior to check-in.
            </p>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                Reason for Cancellation (Optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change in travel plans..."
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#A3998C] hover:text-[#FAF7F2]"
              >
                Keep Booking
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-500 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automated Email Preview Modal */}
      {selectedEmail && (
        <EmailPreviewModal
          isOpen={!!selectedEmail}
          onClose={() => setSelectedEmail(null)}
          email={selectedEmail}
          guestName={user.name}
          bookingNumber={selectedEmail.related_booking}
        />
      )}
    </div>
  );
}
