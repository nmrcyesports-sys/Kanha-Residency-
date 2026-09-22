import type {
  User,
  Room,
  Amenity,
  Booking,
  PaymentRecord,
  RoomAvailability,
  Review,
  Enquiry,
  GalleryItem,
  EmailTemplate,
  EmailLog,
  Coupon,
  SiteSettings,
  AuditLog,
  AdminNotification,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('kr_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    address?: string;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Rooms
  async getRooms(all = false): Promise<Room[]> {
    const res = await fetch(`${API_BASE}/rooms${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to load rooms');
    return res.json();
  },

  async getRoom(id: string): Promise<Room> {
    const res = await fetch(`${API_BASE}/rooms/${id}`);
    if (!res.ok) throw new Error('Room not found');
    return res.json();
  },

  async createRoom(data: Partial<Room>): Promise<Room> {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create room');
    }
    return res.json();
  },

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update room');
    }
    return res.json();
  },

  async updateRoomPrice(
    id: string,
    data: { price?: number; discount_price?: number; inventory_count?: number; status?: string }
  ): Promise<Room> {
    const res = await fetch(`${API_BASE}/rooms/${id}/price`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update room price');
    }
    return res.json();
  },

  async deleteRoom(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete room');
    return res.json();
  },

  // Availability & Pricing
  async checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<{ available: boolean }> {
    const res = await fetch(
      `${API_BASE}/availability/check?roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(checkOut)}`
    );
    if (!res.ok) throw new Error('Failed to check availability');
    return res.json();
  },

  async getAvailability(roomId?: string): Promise<RoomAvailability[]> {
    const url = roomId ? `${API_BASE}/availability/calendar?roomId=${roomId}` : `${API_BASE}/availability/calendar`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch availability');
    return res.json();
  },

  async blockDates(roomId: string, dates: string[], status: 'blocked' | 'maintenance', notes?: string) {
    const res = await fetch(`${API_BASE}/availability/block`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomId, dates, status, notes }),
    });
    if (!res.ok) throw new Error('Failed to block dates');
    return res.json();
  },

  async unblockDates(roomId: string, dates: string[]) {
    const res = await fetch(`${API_BASE}/availability/unblock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomId, dates }),
    });
    if (!res.ok) throw new Error('Failed to unblock dates');
    return res.json();
  },

  async calculatePricing(
    roomId: string,
    checkIn: string,
    checkOut: string,
    couponCode?: string
  ): Promise<{
    roomId: string;
    roomName: string;
    nightlyPrice: number;
    nights: number;
    subtotal: number;
    discount: number;
    taxRatePercentage: number;
    tax: number;
    total: number;
  }> {
    const res = await fetch(`${API_BASE}/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, checkIn, checkOut, couponCode }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to calculate pricing');
    }
    return res.json();
  },

  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount }),
    });
    return res.json();
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Booking failed');
    }
    return res.json();
  },

  async getBookings(filters?: { status?: string; payment_status?: string; roomId?: string; search?: string }): Promise<Booking[]> {
    const query = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_BASE}/bookings?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBooking(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Cancellation failed');
    }
    return res.json();
  },

  async getUserBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/user/bookings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your bookings');
    return res.json();
  },

  // Payments
  async getPayments(): Promise<PaymentRecord[]> {
    const res = await fetch(`${API_BASE}/payments`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentRecord> {
    const res = await fetch(`${API_BASE}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, reason }),
    });
    if (!res.ok) throw new Error('Refund failed');
    return res.json();
  },

  // Reviews
  async getReviews(all = false): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitReview(data: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async updateReviewStatus(id: string, status: Review['status']): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  },

  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete review');
  },

  // Enquiries
  async submitEnquiry(data: { name: string; email: string; phone?: string; message: string }): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit enquiry');
    return res.json();
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async updateEnquiry(id: string, status: Enquiry['status'], notes?: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async addGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Amenities
  async getAmenities(): Promise<Amenity[]> {
    const res = await fetch(`${API_BASE}/amenities`);
    if (!res.ok) throw new Error('Failed to fetch amenities');
    return res.json();
  },

  // Email Templates & Logs
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const res = await fetch(`${API_BASE}/email-templates`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getEmailLogs(query?: { recipient?: string; booking?: string }): Promise<EmailLog[]> {
    let url = `${API_BASE}/email-logs`;
    const params = new URLSearchParams();
    if (query?.recipient) params.append('recipient', query.recipient);
    if (query?.booking) params.append('booking', query.booking);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async sendTestEmail(to: string, templateName = 'Booking Confirmed', customData?: any): Promise<EmailLog> {
    const res = await fetch(`${API_BASE}/email-send-test`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ to, templateName, customData }),
    });
    if (!res.ok) throw new Error('Failed to send test email');
    return res.json();
  },

  async retryEmail(id: string): Promise<EmailLog> {
    const res = await fetch(`${API_BASE}/email-logs/${id}/retry`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async verifySmtp(config: { host?: string; port?: number; user?: string; pass?: string; secure?: boolean; testRecipient?: string }): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/smtp/test`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<AdminNotification[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markNotificationRead(id: string) {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  },

  async clearNotifications() {
    await fetch(`${API_BASE}/notifications`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Stats
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Export
  getExportUrl(type: 'bookings' | 'payments' | 'enquiries') {
    return `${API_BASE}/export/${type}`;
  },
};
