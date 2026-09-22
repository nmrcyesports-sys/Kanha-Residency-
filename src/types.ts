/**
 * Kanha Residency - Domain Types & Data Models
 */

export type UserRole = 'Guest' | 'Admin' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  address?: string;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'Active' | 'Inactive';
}

export type RoomStatus = 'Active' | 'Inactive' | 'Maintenance';

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  discount_price?: number;
  max_guests: number;
  bed_type: string;
  room_size: string; // e.g. "310 sq.ft"
  amenities: string[];
  images: string[];
  featured_image: string;
  status: RoomStatus;
  featured: boolean;
  inventory_count: number;
  created_at: string;
  updated_at: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked In'
  | 'Checked Out'
  | 'Cancelled'
  | 'No Show';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type PaymentMethod = 'UPI' | 'Cards' | 'Net Banking' | 'Wallets';

export interface PolicyConsent {
  terms: boolean;
  cancellation: boolean;
  privacy: boolean;
  timestamp: string;
  version: string;
}

export interface GuestInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  special_requests?: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  room_id: string;
  room_name: string;
  room_image?: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  guests: number;
  rooms_count: number;
  nights: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_id?: string;
  payment_method?: PaymentMethod;
  special_request?: string;
  policy_consent: PolicyConsent;
  guest: GuestInfo;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  booking_id: string;
  booking_number: string;
  guest_name: string;
  payment_id: string;
  gateway: 'Razorpay' | 'Stripe' | 'UPI_Direct';
  amount: number;
  currency: string;
  status: 'Success' | 'Failed' | 'Refunded' | 'Pending';
  transaction_reference: string;
  payment_method: PaymentMethod;
  paid_at: string;
  created_at: string;
  refund?: {
    refund_id: string;
    amount: number;
    status: 'Requested' | 'Processing' | 'Completed' | 'Failed';
    reason: string;
    processed_at: string;
  };
}

export interface RoomAvailability {
  id: string;
  room_id: string;
  date: string; // YYYY-MM-DD
  status: 'available' | 'booked' | 'blocked' | 'maintenance';
  booking_id?: string;
  notes?: string;
}

export interface Review {
  id: string;
  booking_id?: string;
  user_id?: string;
  user_name: string;
  user_location?: string;
  room_id: string;
  room_name: string;
  rating: number; // 1 to 5
  title?: string;
  review: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  verified_guest: boolean;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Resolved';
  admin_notes?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Property' | 'Rooms' | 'Interiors' | 'Experience' | 'Mathura';
  image: string;
  description: string;
  sort_order: number;
  status: 'Active' | 'Inactive';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: 'Active' | 'Inactive';
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  template_name: string;
  status: 'Sent' | 'Failed' | 'Queued';
  sent_time: string;
  error?: string;
  related_booking?: string;
  body?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount: number;
  maximum_discount: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  times_used: number;
  status: 'Active' | 'Expired' | 'Disabled';
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure?: boolean;
  from?: string;
}

export interface SiteSettings {
  property_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  google_maps_url: string;
  tax_percentage: number;
  service_charge: number;
  cancellation_policy: 'Flexible' | 'Moderate' | 'Strict';
  free_cancellation_hours: number;
  hero_title: string;
  hero_subtitle: string;
  hero_location: string;
  hero_image: string;
  about_title: string;
  about_description: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tripadvisor?: string;
  };
  smtp_config?: SmtpConfig;
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  entity: string;
  entity_id: string;
  old_value?: string;
  new_value?: string;
  timestamp: string;
  ip_address: string;
}

export interface AdminNotification {
  id: string;
  type: 'booking' | 'payment' | 'cancellation' | 'enquiry' | 'review' | 'refund';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}
