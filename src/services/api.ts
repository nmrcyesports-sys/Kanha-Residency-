import { DEFAULT_ROOMS } from '../data/defaultRooms';
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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Robust JSON fetch wrapper that guards against HTML 404/502/503 responses,
 * preventing "Unexpected token 'T', 'The page c'... is not valid JSON" crashes.
 */
async function requestJson<T = any>(
  endpoint: string,
  options?: RequestInit,
  fallbackErrorMessage = 'Request failed'
): Promise<T> {
  const url = endpoint.startsWith('http') || endpoint.startsWith('/api') ? endpoint : `${API_BASE}${endpoint}`;
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network connection failed. Please check your internet connection.');
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let errorMsg = `${fallbackErrorMessage} (${res.status})`;
    if (isJson) {
      try {
        const data = await res.json();
        errorMsg = data.error || data.message || errorMsg;
      } catch {
        // ignore parse error
      }
    } else {
      try {
        const text = await res.text();
        if (text && text.length < 150 && !text.includes('<html') && !text.startsWith('<!')) {
          errorMsg = text.trim();
        } else if (res.status === 404) {
          errorMsg = 'The requested resource was not found.';
        } else if (res.status >= 500) {
          errorMsg = 'The server is currently busy or initializing. Please retry in a moment.';
        }
      } catch {
        // ignore
      }
    }
    throw new Error(errorMsg);
  }

  if (!isJson) {
    try {
      const text = await res.text();
      if (text.startsWith('<') || text.startsWith('The page')) {
        throw new Error('The server is initializing or returned an unexpected response. Please try again.');
      }
      return JSON.parse(text) as T;
    } catch (e: any) {
      if (e.message?.includes('unexpected response')) throw e;
      return {} as T;
    }
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return requestJson(
      '/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
      'Failed to login'
    );
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    address?: string;
  }): Promise<{ user: User; token: string }> {
    return requestJson(
      '/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      'Registration failed'
    );
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return requestJson('/auth/me', { headers: getAuthHeaders() }, 'Not authenticated');
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    return requestJson(
      '/auth/profile',
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      },
      'Failed to update profile'
    );
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return requestJson(
      '/auth/forgot-password',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
      'Failed to process password reset'
    );
  },

  // Rooms
  async getRooms(all = false): Promise<Room[]> {
    try {
      const data = await requestJson<Room[]>(`/rooms${all ? '?all=true' : ''}`, undefined, 'Failed to load rooms');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return DEFAULT_ROOMS;
    } catch {
      return DEFAULT_ROOMS;
    }
  },

  async getRoom(id: string): Promise<Room> {
    try {
      const data = await requestJson<Room>(`/rooms/${id}`, undefined, 'Room not found');
      if (data && data.id) {
        return data;
      }
      const fallback = DEFAULT_ROOMS.find((r) => r.id === id || r.slug === id) || DEFAULT_ROOMS[0];
      return fallback;
    } catch {
      const fallback = DEFAULT_ROOMS.find((r) => r.id === id || r.slug === id) || DEFAULT_ROOMS[0];
      return fallback;
    }
  },

  async createRoom(data: Partial<Room>): Promise<Room> {
    return requestJson(
      '/rooms',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to create room'
    );
  },

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    return requestJson(
      `/rooms/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to update room'
    );
  },

  async updateRoomPrice(
    id: string,
    data: { price?: number; discount_price?: number; inventory_count?: number; status?: string }
  ): Promise<Room> {
    return requestJson(
      `/rooms/${id}/price`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to update room price'
    );
  },

  async deleteRoom(id: string): Promise<{ success: boolean }> {
    return requestJson(
      `/rooms/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete room'
    );
  },

  // Availability & Pricing
  async checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<{ available: boolean }> {
    return requestJson(
      `/availability/check?roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(checkOut)}`,
      undefined,
      'Failed to check availability'
    );
  },

  async getAvailability(roomId?: string): Promise<RoomAvailability[]> {
    const url = roomId ? `/availability/calendar?roomId=${roomId}` : `/availability/calendar`;
    return requestJson(url, undefined, 'Failed to fetch availability');
  },

  async blockDates(roomId: string, dates: string[], status: 'blocked' | 'maintenance', notes?: string) {
    return requestJson(
      '/availability/block',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ roomId, dates, status, notes }),
      },
      'Failed to block dates'
    );
  },

  async unblockDates(roomId: string, dates: string[]) {
    return requestJson(
      '/availability/unblock',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ roomId, dates }),
      },
      'Failed to unblock dates'
    );
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
    return requestJson(
      '/pricing/calculate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, checkIn, checkOut, couponCode }),
      },
      'Failed to calculate pricing'
    );
  },

  async validateCoupon(
    code: string,
    amount: number
  ): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> {
    return requestJson(
      '/coupons/validate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount }),
      },
      'Failed to validate coupon'
    );
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    return requestJson(
      '/bookings',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
      },
      'Booking failed'
    );
  },

  async getBookings(filters?: {
    status?: string;
    payment_status?: string;
    roomId?: string;
    search?: string;
  }): Promise<Booking[]> {
    const query = new URLSearchParams(filters as any).toString();
    return requestJson(
      `/bookings${query ? `?${query}` : ''}`,
      { headers: getAuthHeaders() },
      'Failed to fetch bookings'
    );
  },

  async getBooking(id: string): Promise<Booking> {
    return requestJson(`/bookings/${id}`, undefined, 'Booking not found');
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    return requestJson(
      `/bookings/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
      'Failed to update booking status'
    );
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    return requestJson(
      `/bookings/${id}/cancel`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      },
      'Cancellation failed'
    );
  },

  async getUserBookings(): Promise<Booking[]> {
    return requestJson('/user/bookings', { headers: getAuthHeaders() }, 'Failed to fetch your bookings');
  },

  // Payments
  async getPayments(): Promise<PaymentRecord[]> {
    return requestJson('/payments', { headers: getAuthHeaders() }, 'Failed to fetch payments');
  },

  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentRecord> {
    return requestJson(
      `/payments/${paymentId}/refund`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, reason }),
      },
      'Refund failed'
    );
  },

  // Reviews
  async getReviews(all = false): Promise<Review[]> {
    return requestJson(`/reviews${all ? '?all=true' : ''}`, undefined, 'Failed to fetch reviews');
  },

  async submitReview(data: Partial<Review>): Promise<Review> {
    return requestJson(
      '/reviews',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to submit review'
    );
  },

  async updateReviewStatus(id: string, status: Review['status']): Promise<Review> {
    return requestJson(
      `/reviews/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
      'Failed to update review status'
    );
  },

  async deleteReview(id: string): Promise<void> {
    await requestJson(
      `/reviews/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete review'
    );
  },

  // Enquiries
  async submitEnquiry(data: { name: string; email: string; phone?: string; message: string }): Promise<Enquiry> {
    return requestJson(
      '/enquiries',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      'Failed to submit enquiry'
    );
  },

  async getEnquiries(): Promise<Enquiry[]> {
    return requestJson('/enquiries', { headers: getAuthHeaders() }, 'Failed to fetch enquiries');
  },

  async updateEnquiry(id: string, status: Enquiry['status'], notes?: string): Promise<Enquiry> {
    return requestJson(
      `/enquiries/${id}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      },
      'Failed to update enquiry'
    );
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return requestJson('/gallery', undefined, 'Failed to fetch gallery');
  },

  async addGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    return requestJson(
      '/gallery',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to add gallery item'
    );
  },

  async deleteGalleryItem(id: string): Promise<void> {
    await requestJson(
      `/gallery/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete gallery item'
    );
  },

  // Amenities
  async getAmenities(): Promise<Amenity[]> {
    return requestJson('/amenities', undefined, 'Failed to fetch amenities');
  },

  // Email Templates & Logs
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return requestJson('/email-templates', { headers: getAuthHeaders() }, 'Failed to fetch email templates');
  },

  async getEmailLogs(query?: { recipient?: string; booking?: string }): Promise<EmailLog[]> {
    const params = new URLSearchParams();
    if (query?.recipient) params.append('recipient', query.recipient);
    if (query?.booking) params.append('booking', query.booking);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return requestJson(
      `/email-logs${queryString}`,
      { headers: getAuthHeaders() },
      'Failed to fetch email logs'
    );
  },

  async sendTestEmail(to: string, templateName = 'Booking Confirmed', customData?: any): Promise<EmailLog> {
    return requestJson(
      '/email-send-test',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ to, templateName, customData }),
      },
      'Failed to send test email'
    );
  },

  async retryEmail(id: string): Promise<EmailLog> {
    return requestJson(
      `/email-logs/${id}/retry`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
      'Failed to retry email'
    );
  },

  async verifySmtp(config: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    secure?: boolean;
    testRecipient?: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    return requestJson(
      '/smtp/test',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config),
      },
      'Failed to verify SMTP settings'
    );
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return requestJson('/settings', undefined, 'Failed to fetch settings');
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return requestJson(
      '/settings',
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      },
      'Failed to update settings'
    );
  },

  // Notifications
  async getNotifications(): Promise<AdminNotification[]> {
    return requestJson('/notifications', { headers: getAuthHeaders() }, 'Failed to fetch notifications');
  },

  async markNotificationRead(id: string): Promise<void> {
    await requestJson(
      `/notifications/${id}/read`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      },
      'Failed to mark notification as read'
    );
  },

  async clearNotifications(): Promise<void> {
    await requestJson(
      '/notifications',
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to clear notifications'
    );
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return requestJson('/audit-logs', { headers: getAuthHeaders() }, 'Failed to fetch audit logs');
  },

  // Stats
  async getAdminStats() {
    return requestJson('/admin/stats', { headers: getAuthHeaders() }, 'Failed to fetch admin stats');
  },

  // Export
  getExportUrl(type: 'bookings' | 'payments' | 'enquiries') {
    return `${API_BASE}/export/${type}`;
  },
};
