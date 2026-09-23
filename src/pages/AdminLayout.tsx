import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
  Mail,
  Settings,
  Shield,
  FileText,
  LogOut,
  Bell,
  Search,
  Plus,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Printer,
  Send,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type {
  Booking,
  Room,
  PaymentRecord,
  Review,
  Enquiry,
  GalleryItem,
  EmailLog,
  EmailTemplate,
  SiteSettings,
  AdminNotification,
  AuditLog,
  RoomAvailability,
} from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { AdjustPriceModal } from '../components/AdjustPriceModal';

interface AdminLayoutProps {
  onNavigate: (path: string) => void;
}

export function AdminLayout({ onNavigate }: AdminLayoutProps) {
  const { user, logout, isAdmin, isManager } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'bookings'
    | 'rooms'
    | 'availability'
    | 'enquiries'
    | 'payments'
    | 'reviews'
    | 'gallery'
    | 'emails'
    | 'settings'
    | 'audit'
    | 'handover'
  >('dashboard');

  // Global Admin Data States
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & sub-states
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [adjustingRoom, setAdjustingRoom] = useState<Room | null>(null);
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpResult, setSmtpResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [smtpTestTo, setSmtpTestTo] = useState('luckyrajgupta1994@gmail.com');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // New room modal
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    slug: '',
    short_description: '',
    price: 4500,
    max_guests: 2,
    bed_type: 'King Bed',
    room_size: '350 sq.ft',
    featured_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    amenities: 'Wi-Fi, AC, Smart TV, Ensuite Bathroom, Artisanal Tea',
  });

  // Calendar block modal
  const [blockRoomId, setBlockRoomId] = useState('room_deluxe');
  const [blockStartDate, setBlockStartDate] = useState('');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [blockType, setBlockType] = useState<'blocked' | 'maintenance'>('maintenance');
  const [blockNotes, setBlockNotes] = useState('');
  const [availabilityList, setAvailabilityList] = useState<RoomAvailability[]>([]);

  // Refund modal
  const [refundPayment, setRefundPayment] = useState<PaymentRecord | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Guest requested cancellation');

  // Automated Email Live Test States
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<EmailLog | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState('luckyrajgupta1994@gmail.com');
  const [testEmailTemplate, setTestEmailTemplate] = useState('Booking Confirmed');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailSuccess, setTestEmailSuccess] = useState<string | null>(null);

  // New Gallery item
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'Property' | 'Rooms' | 'Interiors' | 'Experience' | 'Mathura'>('Interiors');
  const [newGalleryImage, setNewGalleryImage] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80');
  const [newGalleryDesc, setNewGalleryDesc] = useState('');

  // Filters for Reviews & Gallery
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('All');

  const refreshAllData = async () => {
    try {
      const results = await Promise.allSettled([
        api.getAdminStats(),
        api.getBookings(),
        api.getRooms(true),
        api.getEnquiries(),
        api.getPayments(),
        api.getReviews(true),
        api.getGallery(),
        api.getEmailLogs(),
        api.getEmailTemplates(),
        api.getNotifications(),
        api.getAuditLogs(),
        api.getSettings(),
        api.getAvailability(),
      ]);

      const getVal = <T,>(idx: number, fallback: T): T => {
        const item = results[idx];
        return item.status === 'fulfilled' && item.value ? (item.value as T) : fallback;
      };

      setStats(getVal(0, stats));
      setBookings(getVal(1, []));
      setRooms(getVal(2, []));
      setEnquiries(getVal(3, []));
      setPayments(getVal(4, []));
      setReviews(getVal(5, []));
      setGallery(getVal(6, []));
      setEmailLogs(getVal(7, []));
      setEmailTemplates(getVal(8, []));
      setNotifications(getVal(9, []));
      setAuditLogs(getVal(10, []));
      const s = getVal(11, null);
      if (s) setSettings(s);
      setAvailabilityList(getVal(12, []));
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Subscribe to live Firestore database synchronization
    const unsubBookings = api.subscribeBookings((liveBookings) => {
      if (liveBookings && liveBookings.length > 0) {
        setBookings(liveBookings);
      }
    });

    const unsubEnquiries = api.subscribeEnquiries((liveEnquiries) => {
      if (liveEnquiries && liveEnquiries.length > 0) {
        setEnquiries(liveEnquiries);
      }
    });

    const unsubReviews = api.subscribeReviews((liveReviews) => {
      if (liveReviews && liveReviews.length > 0) {
        setReviews(liveReviews);
      }
    });

    return () => {
      unsubBookings();
      unsubEnquiries();
      unsubReviews();
    };
  }, []);

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const updated = await api.updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleUpdateReviewStatus = async (id: string, status: Review['status']) => {
    try {
      const updated = await api.updateReviewStatus(id, status);
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest review?')) return;
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const handleUpdateEnquiry = async (id: string, status: Enquiry['status']) => {
    try {
      const updated = await api.updateEnquiry(id, status);
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createRoom({
        name: newRoomData.name,
        slug: newRoomData.name.toLowerCase().replace(/\s+/g, '-'),
        short_description: newRoomData.short_description,
        price: Number(newRoomData.price),
        max_guests: Number(newRoomData.max_guests),
        bed_type: newRoomData.bed_type,
        room_size: newRoomData.room_size,
        featured_image: newRoomData.featured_image,
        amenities: newRoomData.amenities.split(',').map((s) => s.trim()),
        status: 'Active',
      });
      setRooms((prev) => [...prev, created]);
      setShowNewRoomModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create room');
    }
  };

  const handleBlockDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStartDate || !blockEndDate) return;
    const start = new Date(blockStartDate);
    const end = new Date(blockEndDate);
    const dates: string[] = [];
    while (start <= end) {
      dates.push(start.toISOString().split('T')[0]);
      start.setDate(start.getDate() + 1);
    }

    try {
      await api.blockDates(blockRoomId, dates, blockType, blockNotes);
      alert(`Blocked ${dates.length} days successfully.`);
      const updated = await api.getAvailability();
      setAvailabilityList(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundPayment) return;
    try {
      await api.processRefund(refundPayment.id, refundAmount, refundReason);
      alert('Refund processed successfully.');
      setRefundPayment(null);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = await api.addGalleryItem({
        title: newGalleryTitle,
        category: newGalleryCategory,
        image: newGalleryImage,
        description: newGalleryDesc,
        sort_order: 0,
        status: 'Active',
      });
      setGallery((prev) => [item, ...prev]);
      setNewGalleryTitle('');
      setNewGalleryDesc('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Remove this photo from gallery?')) return;
    try {
      await api.deleteGalleryItem(id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRetryEmail = async (id: string) => {
    try {
      const updated = await api.retryEmail(id);
      setEmailLogs((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      alert('Email retry executed.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient) return;
    setTestEmailSending(true);
    setTestEmailSuccess(null);
    try {
      const log = await api.sendTestEmail(testEmailRecipient, testEmailTemplate);
      const templateTitle = log.template_name || testEmailTemplate || 'Booking Confirmed';
      setTestEmailSuccess(`Dispatched automated "${templateTitle}" email to ${log.recipient} successfully`);
      setEmailLogs((prev) => [log, ...prev.filter((item) => item.id !== log.id)]);
      const updated = await api.getEmailLogs();
      if (Array.isArray(updated) && updated.length > 0) {
        setEmailLogs(updated);
      }
      setSelectedEmailPreview(log);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch test email');
    } finally {
      setTestEmailSending(false);
    }
  };

  const formattedAmount = (amt: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
    if (
      bookingSearch &&
      !(b.guest?.full_name || '').toLowerCase().includes(bookingSearch.toLowerCase()) &&
      !b.booking_number.toLowerCase().includes(bookingSearch.toLowerCase()) &&
      !(b.guest?.email || '').toLowerCase().includes(bookingSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#FAF7F2] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#111216] border-r border-[#25221D] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-[#25221D]">
            <BrandLogo size="sm" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880] block">
                Executive Portal
              </span>
              <span className="font-serif text-sm font-semibold text-[#FAF7F2]">
                Kanha Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1 text-xs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'bookings', label: 'Bookings & PMS', icon: CalendarDays, badge: bookings.length },
              { id: 'rooms', label: 'Room Inventory', icon: BedDouble },
              { id: 'availability', label: 'Availability Calendar', icon: Clock },
              { id: 'enquiries', label: 'Enquiries & CRM', icon: MessageSquare, badge: enquiries.filter((e) => e.status === 'New').length > 0 ? `${enquiries.filter((e) => e.status === 'New').length} new` : undefined, badgeColor: 'bg-amber-500/20 text-amber-400' },
              { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
              { id: 'reviews', label: 'Reviews Moderation', icon: CheckCircle2, badge: reviews.filter((r) => r.status === 'Pending').length > 0 ? `${reviews.filter((r) => r.status === 'Pending').length} pending` : `${reviews.length}`, badgeColor: reviews.filter((r) => r.status === 'Pending').length > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-[#2A2621] text-[#A3998C]' },
              { id: 'gallery', label: 'Gallery CMS', icon: ImageIcon, badge: gallery.length },
              { id: 'emails', label: 'Email Automation', icon: Mail },
              { id: 'settings', label: 'Site Settings', icon: Settings },
              { id: 'audit', label: 'Audit Trail', icon: FileText },
              { id: 'handover', label: 'Handover & Docs', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#25211B] text-[#E5C79E] border border-[#C5A880]/40'
                      : 'text-[#A3998C] hover:text-[#FAF7F2] hover:bg-[#1A1C22]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#C5A880]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-[#2A2621] text-[#A3998C]'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#25221D] space-y-3">
          <div className="text-xs text-[#A3998C]">
            <div className="font-semibold text-[#FAF7F2] truncate">{user?.name}</div>
            <div className="text-[10px] text-[#C5A880] uppercase tracking-wider">
              {user?.role} Access
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => onNavigate('/')}
              className="flex-1 py-1.5 rounded-lg bg-[#1B1D23] border border-[#2D2822] text-[11px] text-[#A3998C] hover:text-[#FAF7F2] flex items-center justify-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Preview Site</span>
            </button>
            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="p-1.5 rounded-lg bg-[#1B1D23] border border-[#2D2822] text-[#A3998C] hover:text-rose-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-[#111216] border-b border-[#25221D] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            {/* Mobile Tab Switcher */}
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="md:hidden bg-[#1A1C22] border border-[#332E27] rounded-xl px-3 py-1.5 text-xs text-[#FAF7F2]"
            >
              <option value="dashboard">Dashboard</option>
              <option value="bookings">Bookings</option>
              <option value="rooms">Rooms</option>
              <option value="availability">Availability</option>
              <option value="enquiries">Enquiries</option>
              <option value="payments">Payments</option>
              <option value="reviews">Reviews</option>
              <option value="gallery">Gallery</option>
              <option value="emails">Emails</option>
              <option value="settings">Settings</option>
              <option value="audit">Audit</option>
              <option value="handover">Handover</option>
            </select>

            <h1 className="font-serif text-lg font-medium text-[#FAF7F2] capitalize hidden md:block">
              {activeTab === 'dashboard' && 'Hotel Overview & Analytics'}
              {activeTab === 'bookings' && 'Property Management System (PMS)'}
              {activeTab === 'rooms' && 'Suite & Room Catalog'}
              {activeTab === 'availability' && 'Inventory Calendar'}
              {activeTab === 'enquiries' && 'Guest Inquiries & CRM'}
              {activeTab === 'payments' && 'Financial Transactions & Gateway'}
              {activeTab === 'reviews' && 'Guest Testimonial Moderation'}
              {activeTab === 'gallery' && 'Photography Management'}
              {activeTab === 'emails' && 'Email Automation Logs'}
              {activeTab === 'settings' && 'Global Configurations & Policies'}
              {activeTab === 'audit' && 'System Audit Trail'}
              {activeTab === 'handover' && 'Production Handover Dossier'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-2 rounded-xl bg-[#1A1C22] border border-[#2D2822] text-[#A3998C] hover:text-[#FAF7F2] relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A880] text-[#121316] text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#141518] border border-[#332E27] shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#25221D] mb-2 font-semibold">
                    <span>Notifications</span>
                    <button
                      onClick={() => {
                        api.clearNotifications();
                        setNotifications([]);
                      }}
                      className="text-[10px] text-[#C5A880] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-[#8C8377] text-center py-4">No new alerts</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-lg bg-[#1B1D23] border border-[#262420]">
                          <div className="font-semibold text-[#FAF7F2]">{n.title}</div>
                          <div className="text-[11px] text-[#A3998C]">{n.message}</div>
                          <div className="text-[9px] text-[#6E675D] mt-1">
                            {new Date(n.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={refreshAllData}
              className="p-2 rounded-xl bg-[#1A1C22] border border-[#2D2822] text-[#A3998C] hover:text-[#C5A880]"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <main className="p-6 sm:p-8 flex-1">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-2">
                  <div className="flex items-center justify-between text-[#C5A880]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                      Total Revenue
                    </span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#FAF7F2]">
                    {formattedAmount(stats.totalRevenue)}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Real Gateway Authorizations</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-2">
                  <div className="flex items-center justify-between text-[#C5A880]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                      Total Bookings
                    </span>
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#FAF7F2]">
                    {stats.totalBookings}
                  </div>
                  <div className="text-[11px] text-[#A3998C]">
                    Active Rooms: {stats.activeRooms} Suites
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-2">
                  <div className="flex items-center justify-between text-[#C5A880]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                      Occupancy Rate
                    </span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#E5C79E]">
                    {stats.occupancyRate}%
                  </div>
                  <div className="text-[11px] text-[#A3998C]">
                    Today Check-ins: {stats.todayCheckIns}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-2">
                  <div className="flex items-center justify-between text-[#C5A880]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3998C]">
                      Pending Enquiries
                    </span>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#FAF7F2]">
                    {stats.pendingEnquiries}
                  </div>
                  <div className="text-[11px] text-[#A3998C]">
                    Check-outs today: {stats.todayCheckOuts}
                  </div>
                </div>
              </div>

              {/* Quick PMS Activity: Recent Bookings & Inquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
                    <h3 className="font-serif text-lg font-medium text-[#FAF7F2]">
                      Recent Reservations
                    </h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-[#C5A880] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bookings.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl bg-[#1A1C22] border border-[#25221D] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#FAF7F2]">{b.guest?.full_name || 'Guest'}</div>
                          <div className="text-[11px] text-[#A3998C]">
                            {b.room_name} · {b.check_in} ({b.nights}n)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-[#E5C79E]">
                            {formattedAmount(b.total)}
                          </div>
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#25211B] text-[#C5A880]">
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Enquiries */}
                <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
                    <h3 className="font-serif text-lg font-medium text-[#FAF7F2]">
                      New Enquiries & Pilgrim Queries
                    </h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs text-[#C5A880] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((e) => (
                      <div
                        key={e.id}
                        className="p-3.5 rounded-xl bg-[#1A1C22] border border-[#25221D] space-y-1 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#FAF7F2]">{e.name}</span>
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#2A2621] text-[#E5C79E]">
                            {e.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A3998C] line-clamp-1">{e.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Executive Hub: Guest Testimonials & Showcase Gallery */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guest Testimonials Card */}
                <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
                      <h3 className="font-serif text-lg font-medium text-[#FAF7F2]">
                        Guest Testimonials & Reviews
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25211B] text-[#C5A880] border border-[#C5A880]/30 font-semibold">
                        {reviews.length} Total
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs text-[#C5A880] hover:underline flex items-center space-x-1"
                    >
                      <span>Moderate Reviews</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Summary Rating Stats */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#1A1C22] border border-[#25221D] text-center">
                    <div>
                      <div className="font-serif text-xl font-bold text-[#E5C79E]">
                        {reviews.length > 0
                          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                          : '5.0'} ★
                      </div>
                      <div className="text-[10px] text-[#A3998C] uppercase font-semibold">Avg Rating</div>
                    </div>
                    <div>
                      <div className="font-serif text-xl font-bold text-emerald-400">
                        {reviews.filter((r) => r.status === 'Approved').length}
                      </div>
                      <div className="text-[10px] text-[#A3998C] uppercase font-semibold">Live on Site</div>
                    </div>
                    <div>
                      <div className="font-serif text-xl font-bold text-amber-400">
                        {reviews.filter((r) => r.status === 'Pending').length}
                      </div>
                      <div className="text-[10px] text-[#A3998C] uppercase font-semibold">Pending Action</div>
                    </div>
                  </div>

                  {/* Quick Reviews List */}
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl bg-[#1A1C22] border border-[#25221D] space-y-1 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-[#FAF7F2]">{r.user_name}</span>
                            <span className="text-[10px] text-[#C5A880]">
                              {'★'.repeat(r.rating)}
                            </span>
                            <span className="text-[10px] text-[#8C8377]">({r.room_name})</span>
                          </div>
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                              r.status === 'Approved'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                : r.status === 'Pending'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#FAF7F2] font-medium line-clamp-1">"{r.title}"</p>
                        <p className="text-[11px] text-[#A3998C] line-clamp-2">{r.review}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photography & Gallery Card */}
                <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#25221D]">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-[#C5A880]" />
                      <h3 className="font-serif text-lg font-medium text-[#FAF7F2]">
                        Showcase Media & Gallery
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25211B] text-[#C5A880] border border-[#C5A880]/30 font-semibold">
                        {gallery.length} Photos
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="text-xs text-[#C5A880] hover:underline flex items-center space-x-1"
                    >
                      <span>Manage Gallery</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Category Breakdown Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Property', 'Rooms', 'Interiors', 'Experience', 'Mathura'].map((cat) => {
                      const count = gallery.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;
                      return (
                        <span
                          key={cat}
                          className="px-2.5 py-1 rounded-lg bg-[#1A1C22] border border-[#25221D] text-[10px] text-[#A3998C] flex items-center space-x-1"
                        >
                          <span className="text-[#FAF7F2]">{cat}</span>
                          <span className="text-[#C5A880] font-bold">({count})</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Photo Thumbnails Preview Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.slice(0, 8).map((g) => (
                      <div
                        key={g.id}
                        className="relative group rounded-xl overflow-hidden aspect-video bg-[#1A1C22] border border-[#25221D]"
                      >
                        <img
                          src={g.image}
                          alt={g.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                          <span className="text-[9px] text-[#FAF7F2] truncate font-medium">{g.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#A3998C]">
                    <span>Real-time photo showcase on guest portal</span>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="text-[#C5A880] hover:underline font-semibold text-xs"
                    >
                      + Add New Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS & PMS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Filter & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#141518] border border-[#2D2822]">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-[#A3998C] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder="Search guest, ID, email..."
                      className="w-full bg-[#1A1C22] border border-[#332E27] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="bg-[#1A1C22] border border-[#332E27] rounded-xl px-3 py-1.5 text-xs text-[#FAF7F2]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <a
                    href={api.getExportUrl('bookings')}
                    download
                    className="px-4 py-2 rounded-xl bg-[#1B1D23] border border-[#332E27] text-xs text-[#E5C79E] hover:border-[#C5A880] transition-colors flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] overflow-x-auto shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#181920] border-b border-[#25221D] text-[#A3998C] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Booking #</th>
                      <th className="py-3.5 px-4">Guest</th>
                      <th className="py-3.5 px-4">Room</th>
                      <th className="py-3.5 px-4">Dates</th>
                      <th className="py-3.5 px-4">Paid</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#25221D]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#1A1C24] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-[#FAF7F2]">
                          {b.booking_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#FAF7F2]">{b.guest?.full_name || 'Guest'}</div>
                          <div className="text-[10px] text-[#A3998C]">{b.guest?.phone || 'N/A'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#D8CFBF]">{b.room_name}</td>
                        <td className="py-3.5 px-4 text-[#A3998C]">
                          {b.check_in} → {b.check_out} ({b.nights}n)
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#E5C79E]">
                          {formattedAmount(b.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleUpdateBookingStatus(b.id, e.target.value as Booking['status'])
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border focus:outline-none ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                                : b.status === 'Checked In'
                                ? 'bg-blue-950/60 border-blue-800 text-blue-400'
                                : b.status === 'Checked Out'
                                ? 'bg-stone-900 border-stone-700 text-stone-300'
                                : 'bg-rose-950/60 border-rose-800 text-rose-400'
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Checked In">Checked In</option>
                            <option value="Checked Out">Checked Out</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No Show">No Show</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedInvoiceBooking(b)}
                            className="p-1.5 rounded-lg bg-[#1F2026] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#121316] transition-colors"
                            title="Invoice Voucher"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ROOMS INVENTORY */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#FAF7F2]">Room & Suite Inventory</h3>
                <button
                  onClick={() => setShowNewRoomModal(true)}
                  className="px-4 py-2 rounded-full bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#E5C79E] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="rounded-2xl bg-[#141518] border border-[#2D2822] overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-[#1A1C22]">
                        <img
                          src={room.featured_image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#121316]/90 text-[10px] font-bold text-[#E5C79E]">
                          {formattedAmount(room.price)} / night
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-serif text-xl text-[#FAF7F2]">{room.name}</h4>
                        <p className="text-xs text-[#A3998C] line-clamp-2">
                          {room.short_description}
                        </p>
                        <div className="text-xs text-[#C5A880] pt-2">
                          {room.max_guests} Guests · {room.bed_type} · {room.room_size}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex flex-wrap items-center justify-between gap-2 border-t border-[#25221D] mt-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] uppercase font-bold text-emerald-400">
                          {room.inventory_count || 4} Available
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Quick +/- buttons */}
                        <div className="flex items-center space-x-1 bg-[#1A1C22] border border-[#2D2822] rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await api.updateRoomPrice(room.id, { price: Math.max(500, room.price - 200) });
                              refreshAllData();
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] text-[#A3998C] hover:text-[#FAF7F2] hover:bg-[#252832] transition-colors"
                            title="Decrease ₹200"
                          >
                            -₹200
                          </button>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await api.updateRoomPrice(room.id, { price: room.price + 200 });
                              refreshAllData();
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] text-[#C5A880] hover:text-[#FAF7F2] hover:bg-[#252832] transition-colors"
                            title="Increase ₹200"
                          >
                            +₹200
                          </button>
                        </div>

                        {/* Open Modal Button */}
                        <button
                          type="button"
                          onClick={() => setAdjustingRoom(room)}
                          className="px-2.5 py-1 rounded-lg bg-[#C5A880]/10 border border-[#C5A880]/30 text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880] hover:text-[#121316] transition-all cursor-pointer luxury-btn-hover"
                        >
                          Adjust Price
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AVAILABILITY CALENDAR */}
          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#FAF7F2] mb-1">
                    Room Maintenance & Date Blocking
                  </h3>
                  <p className="text-xs text-[#A3998C]">
                    Block rooms for renovation, offline pilgrim groups, or special festival reservations.
                  </p>
                </div>

                <form onSubmit={handleBlockDates} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Room
                    </label>
                    <select
                      value={blockRoomId}
                      onChange={(e) => setBlockRoomId(e.target.value)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      required
                      value={blockStartDate}
                      onChange={(e) => setBlockStartDate(e.target.value)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] scheme-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      required
                      value={blockEndDate}
                      onChange={(e) => setBlockEndDate(e.target.value)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] scheme-dark"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C79E]"
                    >
                      Apply Date Block
                    </button>
                  </div>
                </form>

                {/* Blocked Dates List */}
                <div className="pt-4 border-t border-[#25221D]">
                  <h4 className="font-serif text-base text-[#FAF7F2] mb-3">
                    Active Calendar Overrides ({availabilityList.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {availabilityList.slice(0, 12).map((av) => (
                      <div
                        key={`${av.room_id}-${av.date}`}
                        className="p-3 rounded-xl bg-[#1B1D23] border border-[#2D2822] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#FAF7F2]">{av.date}</div>
                          <div className="text-[10px] text-[#A3998C]">{av.status}</div>
                        </div>
                        <button
                          onClick={async () => {
                            await api.unblockDates(av.room_id, [av.date]);
                            const updated = await api.getAvailability();
                            setAvailabilityList(updated);
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENQUIRIES & CRM */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#FAF7F2]">Direct Enquiries & Leads</h3>
                <a
                  href={api.getExportUrl('enquiries')}
                  download
                  className="px-4 py-1.5 rounded-xl bg-[#1B1D23] border border-[#332E27] text-xs text-[#E5C79E] flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </a>
              </div>

              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-6 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-base text-[#FAF7F2]">{enq.name}</h4>
                        <div className="text-xs text-[#A3998C]">
                          {enq.email} · {enq.phone || 'No Phone'} ·{' '}
                          {new Date(enq.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateEnquiry(enq.id, e.target.value as Enquiry['status'])
                        }
                        className="px-3 py-1 rounded-lg text-xs bg-[#1B1D23] border border-[#332E27] text-[#C5A880]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <p className="text-xs text-[#D8CFBF] leading-relaxed bg-[#191A20] p-3 rounded-xl border border-[#25221D]">
                      "{enq.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS & REFUNDS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#FAF7F2]">Payment Gateway Logs</h3>
                <a
                  href={api.getExportUrl('payments')}
                  download
                  className="px-4 py-1.5 rounded-xl bg-[#1B1D23] border border-[#332E27] text-xs text-[#E5C79E] flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Transactions</span>
                </a>
              </div>

              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] overflow-x-auto shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#181920] border-b border-[#25221D] text-[#A3998C] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Txn ID</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#25221D]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1A1C24]">
                        <td className="py-3.5 px-4 font-mono text-[#FAF7F2]">{p.id}</td>
                        <td className="py-3.5 px-4 text-[#D8CFBF]">{p.payment_method}</td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#E5C79E]">
                          {formattedAmount(p.amount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === 'Success'
                                ? 'bg-emerald-950 text-emerald-400'
                                : p.status === 'Refunded'
                                ? 'bg-rose-950 text-rose-400'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#A3998C]">
                          {new Date(p.created_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {p.status === 'Success' && (
                            <button
                              onClick={() => {
                                setRefundPayment(p);
                                setRefundAmount(p.amount);
                              }}
                              className="text-xs text-stone-400 hover:text-rose-400 underline"
                            >
                              Issue Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#25221D]">
                <div>
                  <h3 className="font-serif text-2xl text-[#FAF7F2]">Guest Testimonials Moderation</h3>
                  <p className="text-xs text-[#A3998C] mt-1">
                    Review and approve authentic pilgrim feedback before publishing live on the website.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((st) => {
                    const count = st === 'All' ? reviews.length : reviews.filter((r) => r.status === st).length;
                    const isActive = reviewStatusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setReviewStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                          isActive
                            ? 'bg-[#C5A880] text-[#121316] shadow-md shadow-[#C5A880]/20'
                            : 'bg-[#1A1C22] text-[#A3998C] hover:text-[#FAF7F2] border border-[#2D2822]'
                        }`}
                      >
                        <span>{st}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#121316]/30 text-[#121316]' : 'bg-[#25211B] text-[#C5A880]'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews
                  .filter((r) => reviewStatusFilter === 'All' || r.status === reviewStatusFilter)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] flex flex-col sm:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#FAF7F2] text-sm">{r.user_name}</span>
                          <span className="text-xs text-[#C5A880] font-semibold">
                            {'★'.repeat(r.rating)} ({r.rating}/5)
                          </span>
                          <span className="text-[11px] text-[#A3998C] bg-[#1A1C22] px-2 py-0.5 rounded-md border border-[#25221D]">
                            {r.room_name}
                          </span>
                          {r.verified_guest && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
                              <span>✓ Verified Guest</span>
                            </span>
                          )}
                          <span className="text-[10px] text-[#8C8377]">
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-semibold text-[#FAF7F2]">"{r.title}"</h4>
                        <p className="text-xs text-[#D8CFBF] leading-relaxed max-w-3xl">{r.review}</p>
                      </div>

                      {/* Moderation Controls */}
                      <div className="flex items-center space-x-2 shrink-0 pt-1">
                        {r.status !== 'Approved' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-semibold hover:bg-emerald-800 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'Pending' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'Pending')}
                            className="px-3 py-1.5 rounded-lg bg-amber-900/40 border border-amber-700/60 text-amber-300 text-xs font-semibold hover:bg-amber-800/60 transition-colors"
                          >
                            Mark Pending
                          </button>
                        )}
                        {r.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-900/60 border border-rose-700 text-rose-300 text-xs font-semibold hover:bg-rose-800 transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-1.5 rounded-lg bg-[#241b1b] border border-rose-900/40 text-rose-400 hover:bg-rose-950 hover:text-rose-200 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                {reviews.filter((r) => reviewStatusFilter === 'All' || r.status === reviewStatusFilter).length === 0 && (
                  <div className="text-center py-12 rounded-2xl bg-[#141518] border border-[#2D2822]">
                    <p className="text-sm text-[#A3998C]">No testimonials found in "{reviewStatusFilter}" category.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: GALLERY CMS */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Add Photo Form */}
              <div className="p-6 rounded-3xl bg-[#141518] border border-[#2D2822]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-[#FAF7F2]">Add Photo to Gallery</h3>
                  <span className="text-xs text-[#A3998C]">{gallery.length} Photos Live</span>
                </div>
                <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="e.g. Royal Courtyard"
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Category
                    </label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value as any)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    >
                      <option value="Property">Property</option>
                      <option value="Rooms">Rooms</option>
                      <option value="Interiors">Interiors</option>
                      <option value="Experience">Experience</option>
                      <option value="Mathura">Mathura</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={newGalleryImage}
                      onChange={(e) => setNewGalleryImage(e.target.value)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C79E]"
                    >
                      Add Photo
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Property', 'Rooms', 'Interiors', 'Experience', 'Mathura'].map((cat) => {
                  const count = cat === 'All' ? gallery.length : gallery.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;
                  const isActive = galleryCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isActive
                          ? 'bg-[#C5A880] text-[#121316] shadow-md shadow-[#C5A880]/20'
                          : 'bg-[#141518] text-[#A3998C] hover:text-[#FAF7F2] border border-[#2D2822]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#121316]/30 text-[#121316]' : 'bg-[#25211B] text-[#C5A880]'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery
                  .filter((g) => galleryCategoryFilter === 'All' || g.category.toLowerCase() === galleryCategoryFilter.toLowerCase())
                  .map((g) => (
                    <div
                      key={g.id}
                      className="relative group rounded-2xl overflow-hidden bg-[#141518] border border-[#2D2822]"
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="p-3 text-xs bg-gradient-to-t from-[#141518] via-[#141518]/90 to-transparent">
                        <div className="font-semibold text-[#FAF7F2] truncate">{g.title}</div>
                        <div className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">{g.category}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-950/90 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900 shadow-lg"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: EMAIL AUTOMATION */}
          {activeTab === 'emails' && (
            <div className="space-y-8">
              {/* Live Dispatcher Control Card */}
              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-6 sm:p-8 space-y-6 shadow-2xl luxury-card-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#25221D] gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880] block mb-1">
                      PMS Automation Engine
                    </span>
                    <h3 className="font-serif text-2xl text-[#FAF7F2] flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-[#C5A880]" />
                      <span>Automated Email Dispatch & Verification Center</span>
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2" />
                      Automated Trigger Active
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#A3998C] leading-relaxed max-w-3xl">
                  <strong>Where auto-emails live:</strong> Every booking confirmation, cancellation receipt, and concierge guide is automatically compiled from server templates, stamped with a digital check-in QR code, and dispatched via SMTP. Use the live test tool below to verify delivery to any inbox.
                </p>

                {testEmailSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{testEmailSuccess}</span>
                    </div>
                    <span className="text-[11px] underline cursor-pointer" onClick={() => testEmailSuccess && selectedEmailPreview && setSelectedEmailPreview(selectedEmailPreview)}>
                      View Preview
                    </span>
                  </div>
                )}

                <form onSubmit={handleSendTestEmail} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="e.g. luckyrajgupta1994@gmail.com"
                      required
                      className="w-full bg-[#1A1C22] border border-[#2D2822] focus:border-[#C5A880] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none transition-colors luxury-gold-glow"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Email Template
                    </label>
                    <select
                      value={testEmailTemplate}
                      onChange={(e) => setTestEmailTemplate(e.target.value)}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] focus:border-[#C5A880] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none transition-colors [&>option]:bg-[#141518]"
                    >
                      <option value="Booking Confirmed">Booking Confirmed (Suite & Guide)</option>
                      <option value="Booking Cancelled">Booking Cancelled (Refund Voucher)</option>
                      <option value="Pilgrimage Concierge Guide">Pilgrimage Concierge Guide</option>
                      <option value="Pre-Arrival Check-In">Pre-Arrival Digital Check-In</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={testEmailSending}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg shadow-[#C5A880]/20 hover:shadow-[#C5A880]/40 disabled:opacity-50 cursor-pointer luxury-btn-hover"
                    >
                      {testEmailSending ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{testEmailSending ? 'Sending...' : 'Test Send'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Outbox Logs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#FAF7F2]">Automated Dispatch Logs ({emailLogs.length})</h3>
                  <button
                    onClick={refreshAllData}
                    className="text-xs text-[#C5A880] hover:text-[#FAF7F2] flex items-center space-x-1 luxury-pill-hover px-2.5 py-1 rounded-lg border border-[#2D2822]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Logs</span>
                  </button>
                </div>

                <div className="rounded-3xl bg-[#141518] border border-[#2D2822] overflow-x-auto shadow-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#181920] border-b border-[#25221D] text-[#A3998C] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Recipient</th>
                        <th className="py-3 px-4">Template</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Dispatched At</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#25221D]">
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#1A1C24] transition-colors">
                          <td className="py-3 px-4 text-[#FAF7F2] font-mono text-[11px]">{log.recipient}</td>
                          <td className="py-3 px-4 text-[#E5C79E] font-medium">{log.template_name}</td>
                          <td className="py-3 px-4 text-[#D8CFBF] max-w-xs truncate">{log.subject}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.status === 'Sent'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                                  : 'bg-rose-950 text-rose-400 border border-rose-900'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#A3998C]">
                            {new Date(log.sent_time).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedEmailPreview(log)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#1B1D23] border border-[#332E27] text-xs text-[#FAF7F2] hover:border-[#C5A880] transition-colors luxury-btn-hover cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-[#C5A880]" />
                              <span>View Body</span>
                            </button>

                            {log.status === 'Failed' && (
                              <button
                                onClick={() => handleRetryEmail(log.id)}
                                className="text-xs text-[#C5A880] hover:underline"
                              >
                                Retry
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Templates Viewer */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#FAF7F2]">Configured Automated Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emailTemplates.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-2xl bg-[#141518] border border-[#2D2822] space-y-3 text-xs luxury-card-hover"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#E5C79E] text-sm">{t.name}</span>
                        <span className="text-[10px] text-emerald-400 uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900">{t.status}</span>
                      </div>
                      <div className="text-[#FAF7F2] font-medium">{t.subject}</div>
                      <div className="text-[11px] text-[#A3998C] line-clamp-2">
                        {t.body}
                      </div>
                      <div className="pt-2 border-t border-[#25221D] flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedEmailPreview({
                              id: `preview_${t.id}`,
                              recipient: 'guest@example.com',
                              subject: t.subject,
                              template_name: t.name,
                              status: 'Sent',
                              sent_time: new Date().toISOString(),
                              related_booking: 'KR-DEMO-2026',
                              body: t.body,
                            });
                          }}
                          className="inline-flex items-center space-x-1.5 text-xs text-[#C5A880] hover:text-[#E5C79E] transition-colors cursor-pointer group"
                        >
                          <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>Preview Rendered Email</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & POLICIES */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 max-w-3xl">
              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] p-8 space-y-6">
                <h3 className="font-serif text-2xl text-[#FAF7F2] pb-3 border-b border-[#25221D]">
                  Hotel Operations & Tax Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Hotel Brand Name
                    </label>
                    <input
                      type="text"
                      value={settings.property_name}
                      onChange={(e) => setSettings({ ...settings, property_name: e.target.value })}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Concierge Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Cancellation Policy
                    </label>
                    <select
                      value={settings.cancellation_policy}
                      onChange={(e) => setSettings({ ...settings, cancellation_policy: e.target.value as any })}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                    >
                      <option value="Flexible">Flexible (48 Hours Free)</option>
                      <option value="Moderate">Moderate (5 Days Free)</option>
                      <option value="Strict">Strict (Non-refundable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Free Cancellation Window (Hours)
                    </label>
                    <input
                      type="number"
                      value={settings.free_cancellation_hours}
                      onChange={(e) => setSettings({ ...settings, free_cancellation_hours: Number(e.target.value) })}
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                      Goods & Services Tax (GST %)
                    </label>
                    <input
                      type="number"
                      value={settings.tax_percentage}
                      onChange={(e) =>
                        setSettings({ ...settings, tax_percentage: Number(e.target.value) })
                      }
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                    />
                  </div>
                </div>

                {/* Outgoing SMTP Server Configuration */}
                <div className="pt-6 border-t border-[#25221D] space-y-4">
                  <div>
                    <h4 className="font-serif text-base text-[#FAF7F2] flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-[#C5A880]" />
                      <span>Automated Outgoing Mail Server (SMTP)</span>
                    </h4>
                    <p className="text-xs text-[#A3998C]">
                      Configure the NodeMailer delivery transport to dispatch instant booking vouchers, refunds, and pilgrimage concierge guides.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. smtp.gmail.com"
                        value={settings.smtp_config?.host || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtp_config: { ...settings.smtp_config, host: e.target.value } as any,
                          })
                        }
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                        Port
                      </label>
                      <input
                        type="number"
                        placeholder="587 or 465"
                        value={settings.smtp_config?.port || 587}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtp_config: { ...settings.smtp_config, port: Number(e.target.value) } as any,
                          })
                        }
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                        Username / Email
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. kanharesidency@gmail.com"
                        value={settings.smtp_config?.user || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtp_config: { ...settings.smtp_config, user: e.target.value } as any,
                          })
                        }
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                        App Password
                      </label>
                      <input
                        type="password"
                        placeholder="Google 16-char App Password"
                        value={settings.smtp_config?.pass || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtp_config: { ...settings.smtp_config, pass: e.target.value } as any,
                          })
                        }
                        className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Test Dispatch to Client Email */}
                  <div className="p-4 rounded-2xl bg-[#171920] border border-[#2D2822] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] uppercase font-bold text-[#C5A880] mb-1">
                        Send Live Test Email To Client
                      </label>
                      <input
                        type="email"
                        value={smtpTestTo}
                        onChange={(e) => setSmtpTestTo(e.target.value)}
                        placeholder="luckyrajgupta1994@gmail.com"
                        className="w-full bg-[#121316] border border-[#332E27] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={smtpTesting}
                      onClick={async () => {
                        setSmtpTesting(true);
                        setSmtpResult(null);
                        try {
                          const res = await api.verifySmtp({
                            host: settings.smtp_config?.host,
                            port: settings.smtp_config?.port,
                            user: settings.smtp_config?.user,
                            pass: settings.smtp_config?.pass,
                            secure: settings.smtp_config?.secure,
                            testRecipient: smtpTestTo,
                          });
                          setSmtpResult(res);
                          refreshAllData();
                        } catch (err: any) {
                          setSmtpResult({ success: false, error: err.message || 'SMTP verification failed' });
                        } finally {
                          setSmtpTesting(false);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#22242D] border border-[#C5A880]/40 text-[#C5A880] hover:text-[#FAF7F2] hover:bg-[#C5A880] hover:text-[#121316] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shrink-0 cursor-pointer flex items-center space-x-2"
                    >
                      {smtpTesting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Verify & Send Test Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {smtpResult && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
                        smtpResult.success
                          ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/70 border border-rose-800 text-rose-300'
                      }`}
                    >
                      {smtpResult.success ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>
                        {smtpResult.success
                          ? smtpResult.message || `SMTP handshake succeeded and test email dispatched to ${smtpTestTo}!`
                          : smtpResult.error || 'SMTP Connection failed'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={async () => {
                    await api.updateSettings(settings);
                    alert('Settings updated.');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C79E]"
                >
                  Save Global Configuration
                </button>
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-[#FAF7F2]">Audit Trail & Security Logs</h3>
              <div className="rounded-3xl bg-[#141518] border border-[#2D2822] overflow-x-auto shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#181920] border-b border-[#25221D] text-[#A3998C] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Entity</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#25221D]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#1A1C24]">
                        <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                          {log.user_name}
                        </td>
                        <td className="py-3.5 px-4 text-[#E5C79E]">{log.action}</td>
                        <td className="py-3.5 px-4 text-[#A3998C] font-mono">
                          {log.entity}:{log.entity_id}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A7369]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: HANDOVER GUIDE */}
          {activeTab === 'handover' && (
            <div className="space-y-6 max-w-4xl text-xs sm:text-sm text-[#B5ABA0] leading-relaxed">
              <div className="p-8 rounded-3xl bg-[#141518] border border-[#C5A880]/30 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880] block mb-1">
                    Production Dossier
                  </span>
                  <h3 className="font-serif text-3xl text-[#FAF7F2]">
                    Kanha Residency — Handover & Deployment Guide
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1C24] border border-[#332E27] space-y-2 text-xs">
                  <h4 className="font-bold text-[#E5C79E] uppercase tracking-wider">
                    1. System Credentials
                  </h4>
                  <p>
                    <strong>Admin Email:</strong> <code>admin@kanharesidency.com</code> | <strong>Password:</strong> <code>Admin@Kanha2026</code>
                  </p>
                  <p>
                    <strong>Manager Email:</strong> <code>manager@kanharesidency.com</code> | <strong>Password:</strong> <code>Manager@Kanha2026</code>
                  </p>
                  <p>
                    <strong>Guest Demo Email:</strong> <code>guest@kanharesidency.com</code> | <strong>Password:</strong> <code>Guest@Kanha2026</code>
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-[#FAF7F2]">2. Verified Business Rules</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#C4B8A9]">
                    <li>
                      <strong>Server-Side Pricing Recalculation:</strong> All room rates, nights, discounts (e.g. <code>WELCOME10</code> for 10% off), and 12% GST are calculated server-side in <code>server/db.ts</code> before payment gateway authorization.
                    </li>
                    <li>
                      <strong>Availability Guard:</strong> Double-booking is blocked server-side. Date blocking updates the availability matrix instantly.
                    </li>
                    <li>
                      <strong>Email Automation:</strong> Booking confirmations, cancellations, and enquiries dispatch records into the email outbox logger with manual retry capability.
                    </li>
                    <li>
                      <strong>Official Location:</strong> Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, UP 281006.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-[#FAF7F2]">3. Production Deployment Build Command</h4>
                  <div className="p-4 rounded-xl bg-black font-mono text-xs text-emerald-400">
                    npm run build && npm start
                  </div>
                  <p className="text-xs text-[#A3998C]">
                    Vite bundles the frontend into <code>dist/</code> and esbuild compiles <code>server.ts</code> to a self-contained <code>dist/server.cjs</code> file for standalone container execution on port 3000.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

      {/* New Room Modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#141518] border border-[#332E27] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-2xl text-[#FAF7F2]">Add New Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  placeholder="e.g. Presidential Sanctum Suite"
                  className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                    Nightly Rate (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newRoomData.price}
                    onChange={(e) => setNewRoomData({ ...newRoomData, price: Number(e.target.value) })}
                    className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    required
                    value={newRoomData.max_guests}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, max_guests: Number(e.target.value) })
                    }
                    className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={newRoomData.short_description}
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, short_description: e.target.value })
                  }
                  className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C5A880] text-[#121316] font-bold uppercase tracking-wider"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundPayment && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#141518] border border-[#332E27] rounded-3xl p-6 space-y-4">
            <h3 className="font-serif text-2xl text-[#FAF7F2]">Process Refund</h3>
            <p className="text-xs text-[#A3998C]">
              Authorize refund for transaction ID {refundPayment.id}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  max={refundPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#A3998C] mb-1">
                  Reason for Refund
                </label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-[#FAF7F2]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setRefundPayment(null)}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-500"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automated Email Preview Modal */}
      {selectedEmailPreview && (
        <EmailPreviewModal
          isOpen={!!selectedEmailPreview}
          onClose={() => setSelectedEmailPreview(null)}
          email={selectedEmailPreview}
          guestName={selectedEmailPreview.recipient.split('@')[0]}
          bookingNumber={selectedEmailPreview.related_booking}
        />
      )}

      {/* Dynamic Price & Inventory Modal */}
      {adjustingRoom && (
        <AdjustPriceModal
          room={adjustingRoom}
          onClose={() => setAdjustingRoom(null)}
          onSaved={refreshAllData}
        />
      )}
    </div>
  );
}
