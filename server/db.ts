import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  UserRole,
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
} from '../src/types';

interface DatabaseSchema {
  users: (User & { passwordHash: string; salt: string })[];
  rooms: Room[];
  amenities: Amenity[];
  availability: RoomAvailability[];
  bookings: Booking[];
  payments: PaymentRecord[];
  reviews: Review[];
  enquiries: Enquiry[];
  gallery: GalleryItem[];
  emailTemplates: EmailTemplate[];
  emailLogs: EmailLog[];
  coupons: Coupon[];
  siteSettings: SiteSettings;
  auditLogs: AuditLog[];
  notifications: AdminNotification[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kanha_db.json');

// Password utility
export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, s, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

function getInitialData(): DatabaseSchema {
  const adminCred = hashPassword('KanhaAdmin@2026');
  const mgrCred = hashPassword('KanhaManager@2026');
  const guestCred = hashPassword('Guest@1234');

  const now = new Date().toISOString();

  const users: DatabaseSchema['users'] = [
    {
      id: 'usr_admin_1',
      name: 'Executive Concierge Admin',
      email: 'admin@kanharesidency.com',
      phone: '+91 98765 43210',
      role: 'Admin',
      status: 'Active',
      passwordHash: adminCred.hash,
      salt: adminCred.salt,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'usr_mgr_1',
      name: 'Operations Manager',
      email: 'manager@kanharesidency.com',
      phone: '+91 98765 43211',
      role: 'Manager',
      status: 'Active',
      passwordHash: mgrCred.hash,
      salt: mgrCred.salt,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'usr_guest_1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98111 22334',
      role: 'Guest',
      status: 'Active',
      passwordHash: guestCred.hash,
      salt: guestCred.salt,
      address: 'Sector 45, Gurgaon, Haryana',
      created_at: now,
      updated_at: now,
    },
  ];

  const amenities: Amenity[] = [
    { id: 'amen_wifi', name: 'High-Speed Wi-Fi', description: 'Ultra-fast fiber optic connection throughout property', icon: 'Wifi', status: 'Active' },
    { id: 'amen_ac', name: 'Climate Control AC', description: 'Whisper-quiet multi-split climate inverter cooling', icon: 'Wind', status: 'Active' },
    { id: 'amen_tv', name: '55" 4K Smart TV', description: 'Curated OTT apps and live spiritual broadcasts', icon: 'Tv', status: 'Active' },
    { id: 'amen_dining', name: '24/7 In-Room Dining', description: 'Pure vegetarian Mathura & global gourmet delicacies', icon: 'UtensilsCrossed', status: 'Active' },
    { id: 'amen_bath', name: 'Italian Marble Ensuite', description: 'Rain shower with organic Ayurvedic botanicals', icon: 'Bath', status: 'Active' },
    { id: 'amen_wardrobe', name: 'Handcrafted Teak Wardrobe', description: 'Spacious hanging space with electronic safe', icon: 'Shield', status: 'Active' },
    { id: 'amen_kettle', name: 'Artisanal Tea Station', description: 'Selection of organic herbal infusions and coffee', icon: 'Coffee', status: 'Active' },
    { id: 'amen_desk', name: 'Temple & Darshan Desk', description: 'Priority VIP pass assistance for Mathura & Vrindavan', icon: 'Compass', status: 'Active' },
  ];

  const rooms: Room[] = [
    {
      id: 'room_deluxe',
      name: 'Deluxe Room',
      slug: 'deluxe-room',
      short_description: 'A cozy and elegant room designed for comfort, featuring modern amenities and a serene atmosphere.',
      description: 'Crafted for discerning solo pilgrims and couples, the Deluxe Room harmoniously blends timeless Indian warmth with contemporary minimalist elegance. Enjoy custom king bedding dressed in 400-thread-count Egyptian cotton, acoustic double-glazed soundproofing for tranquil meditation, and custom ambient lighting designed for restful recovery after sacred darshan tours.',
      price: 3500,
      discount_price: 3150,
      max_guests: 2,
      bed_type: 'King Bed',
      room_size: '310 sq.ft',
      amenities: ['High-Speed Wi-Fi', 'Climate Control AC', '55" 4K Smart TV', '24/7 In-Room Dining', 'Italian Marble Ensuite', 'Artisanal Tea Station'],
      featured_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'Active',
      featured: true,
      inventory_count: 6,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'room_superior',
      name: 'Superior Room',
      slug: 'superior-room',
      short_description: 'Spacious sanctuary with bespoke timber accents, courtyard view, and an oversized rain bath.',
      description: 'The Superior Room elevates your spiritual retreat with enhanced square footage, an inviting seating lounge by panoramic windows, and views overlooking the peaceful inner courtyard garden. Features artisanal brass fixtures, hand-loomed rugs, and a marble bath that creates a personal sanctuary.',
      price: 4500,
      discount_price: 4050,
      max_guests: 2,
      bed_type: 'King Bed',
      room_size: '350 sq.ft',
      amenities: ['High-Speed Wi-Fi', 'Climate Control AC', '55" 4K Smart TV', '24/7 In-Room Dining', 'Italian Marble Ensuite', 'Handcrafted Teak Wardrobe', 'Temple & Darshan Desk'],
      featured_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'Active',
      featured: true,
      inventory_count: 5,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'room_family_suite',
      name: 'Family Suite',
      slug: 'family-suite',
      short_description: 'Expansive family residence with dual bedrooms, plush dining nook, and generous living area.',
      description: 'Ideal for multigenerational families visiting Braj Bhumi together, the Family Suite provides dual queen beds, two private dressing vanity nooks, and a serene common sitting room. The suite is outfitted with child and elder safety considerations, complimentary puja preparation kits, and express room dining services.',
      price: 6500,
      discount_price: 5850,
      max_guests: 4,
      bed_type: '2 Queen Beds',
      room_size: '520 sq.ft',
      amenities: ['High-Speed Wi-Fi', 'Climate Control AC', '55" 4K Smart TV', '24/7 In-Room Dining', 'Italian Marble Ensuite', 'Handcrafted Teak Wardrobe', 'Artisanal Tea Station', 'Temple & Darshan Desk'],
      featured_image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'Active',
      featured: true,
      inventory_count: 3,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'room_premium_suite',
      name: 'Premium Suite',
      slug: 'premium-suite',
      short_description: 'The pinnacle of luxury at Kanha Residency. Private balcony, bespoke lounge, and private butler service.',
      description: 'Our flagship accommodation offers peerless luxury in Mathura. The Premium Suite features an expansive private balcony overlooking peaceful Mathura sunrises, an opulent living salon with hand-carved jali panels, a deep soaking tub with panoramic vistas, and dedicated concierge access for personalized private temple journeys.',
      price: 8500,
      discount_price: 7650,
      max_guests: 4,
      bed_type: 'Royal King Bed',
      room_size: '720 sq.ft',
      amenities: ['High-Speed Wi-Fi', 'Climate Control AC', '55" 4K Smart TV', '24/7 In-Room Dining', 'Italian Marble Ensuite', 'Handcrafted Teak Wardrobe', 'Artisanal Tea Station', 'Temple & Darshan Desk'],
      featured_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'Active',
      featured: true,
      inventory_count: 2,
      created_at: now,
      updated_at: now,
    },
  ];

  const bookings: Booking[] = [
    {
      id: 'bk_2026_01',
      booking_number: 'KR20260425',
      user_id: 'usr_guest_1',
      room_id: 'room_deluxe',
      room_name: 'Deluxe Room',
      room_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      check_in: '2026-04-25',
      check_out: '2026-04-28',
      guests: 2,
      rooms_count: 1,
      nights: 3,
      subtotal: 10500,
      tax: 1260,
      discount: 0,
      total: 11760,
      status: 'Confirmed',
      payment_status: 'Paid',
      payment_id: 'pay_kr_init_01',
      payment_method: 'UPI',
      special_request: 'Quiet top-floor room with early check-in for morning Yamuna aarti if possible.',
      policy_consent: {
        terms: true,
        cancellation: true,
        privacy: true,
        timestamp: now,
        version: 'v1.0-2026',
      },
      guest: {
        full_name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98111 22334',
        address: 'Sector 45',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        special_requests: 'Quiet top-floor room with early check-in for morning Yamuna aarti.',
      },
      created_at: now,
      updated_at: now,
    },
  ];

  const payments: PaymentRecord[] = [
    {
      id: 'pay_rec_1',
      booking_id: 'bk_2026_01',
      booking_number: 'KR20260425',
      guest_name: 'Rahul Sharma',
      payment_id: 'pay_kr_init_01',
      gateway: 'Razorpay',
      amount: 11760,
      currency: 'INR',
      status: 'Success',
      transaction_reference: 'UPI/2026/894372910/KANHA',
      payment_method: 'UPI',
      paid_at: now,
      created_at: now,
    },
  ];

  const reviews: Review[] = [
    {
      id: 'rev_1',
      booking_id: 'bk_2026_01',
      user_id: 'usr_guest_1',
      user_name: 'Rahul Sharma',
      user_location: 'Gurgaon, Haryana',
      room_id: 'room_deluxe',
      room_name: 'Deluxe Room',
      rating: 5,
      title: 'An oasis of peace in Mathura',
      review: 'Kanha Residency was the highlight of our Mathura & Vrindavan pilgrimage. The tranquil aesthetics, impeccably clean linen, warm courteous staff, and pure sattvic culinary offerings made our stay unforgettable. The concierge arranged our early morning VIP darshan with effortless grace.',
      status: 'Approved',
      verified_guest: true,
      created_at: now,
    },
    {
      id: 'rev_2',
      user_name: 'Ananya & Vikram Deshmukh',
      user_location: 'Pune, Maharashtra',
      room_id: 'room_family_suite',
      room_name: 'Family Suite',
      rating: 5,
      title: 'Perfect for family and elderly parents',
      review: 'Traveled with my 72-year-old parents. The lift access, comfortable bedding, and quiet ambience after long temple walks was exactly what we prayed for. Highly recommended for families seeking peace and luxury.',
      status: 'Approved',
      verified_guest: true,
      created_at: now,
    },
    {
      id: 'rev_3',
      user_name: 'Dr. Siddharth Roy',
      user_location: 'Kolkata, West Bengal',
      room_id: 'room_premium_suite',
      room_name: 'Premium Suite',
      rating: 5,
      title: 'World-class hospitality rooted in Braj tradition',
      review: 'Subtle incense, warm tea upon arrival, and breathtaking architectural details. Kanha Residency sets a new standard for hospitality in Uttar Pradesh.',
      status: 'Approved',
      verified_guest: true,
      created_at: now,
    },
  ];

  const gallery: GalleryItem[] = [
    {
      id: 'gal_1',
      title: 'Grand Facade & Evening Illumination',
      category: 'Property',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      description: 'Evening ambience and architectural warmth at Kanha Residency',
      sort_order: 1,
      status: 'Active',
    },
    {
      id: 'gal_2',
      title: 'Deluxe Suite Living Sanctuary',
      category: 'Rooms',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      description: 'Plush bedding and tailored wooden finishes',
      sort_order: 2,
      status: 'Active',
    },
    {
      id: 'gal_3',
      title: 'Handcrafted Lobby & Concierge Lounge',
      category: 'Interiors',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: 'Intricate brass lamps and warm stone surfaces',
      sort_order: 3,
      status: 'Active',
    },
    {
      id: 'gal_4',
      title: 'Shri Krishna Janmabhoomi Darshan',
      category: 'Mathura',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
      description: 'The sacred birthplace of Lord Krishna in Mathura (10 mins away)',
      sort_order: 4,
      status: 'Active',
    },
    {
      id: 'gal_5',
      title: 'Prem Mandir Evening Light Illumination',
      category: 'Experience',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
      description: 'Mesmerizing Italian marble temple in nearby Vrindavan',
      sort_order: 5,
      status: 'Active',
    },
    {
      id: 'gal_6',
      title: 'Morning Yamuna Aarti at Vishram Ghat',
      category: 'Mathura',
      image: 'https://images.unsplash.com/photo-1627894006066-b4520790175b?auto=format&fit=crop&w=1200&q=80',
      description: 'Traditional morning prayers and sacred river reflections',
      sort_order: 6,
      status: 'Active',
    },
    {
      id: 'gal_7',
      title: 'Artisanal Dining & Sattvic Breakfast',
      category: 'Interiors',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
      description: 'Freshly prepared vegetarian nourishment for body and soul',
      sort_order: 7,
      status: 'Active',
    },
    {
      id: 'gal_8',
      title: 'Courtyard Water Feature & Zen Seating',
      category: 'Property',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
      description: 'Reflective pond and meditation seating for quiet contemplation',
      sort_order: 8,
      status: 'Active',
    },
  ];

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'tpl_welcome',
      name: 'Welcome Email',
      subject: 'Welcome to the Kanha Residency Circle, {{guest_name}}',
      body: 'Namaste {{guest_name}},\n\nWelcome to Kanha Residency, Mathura. We are delighted to have you as part of our circle. Whether you are traveling for sacred darshan or a tranquil retreat in Braj, our concierge team is at your complete service.\n\nWarm regards,\nKanha Residency Concierge\nMathura, Uttar Pradesh',
      status: 'Active',
    },
    {
      id: 'tpl_booking_created',
      name: 'Booking Received',
      subject: 'Reservation Received: {{booking_id}} - Kanha Residency',
      body: 'Namaste {{guest_name}},\n\nYour reservation request for {{room_name}} has been received for the dates {{check_in}} to {{check_out}} for {{guests}} guests.\n\nTotal: ₹{{total}}\n\nYour room is currently being confirmed by our reservations desk.\n\nKanha Residency, Mathura',
      status: 'Active',
    },
    {
      id: 'tpl_booking_confirmed',
      name: 'Booking Confirmed',
      subject: 'Confirmed: Your Stay at Kanha Residency (ID: {{booking_id}})',
      body: 'Namaste {{guest_name}},\n\nWe are overjoyed to confirm your stay at Kanha Residency, Mathura.\n\nBooking ID: {{booking_id}}\nRoom: {{room_name}}\nCheck-in: {{check_in}} (from 14:00)\nCheck-out: {{check_out}} (until 11:00)\nGuests: {{guests}}\nTotal Paid: ₹{{total}}\n\nLocation: CMWM+RJX, Techman Nilgiri, Mathura, UP 281006.\n\nWe eagerly await welcoming you,\nKanha Residency Management',
      status: 'Active',
    },
    {
      id: 'tpl_cancellation',
      name: 'Booking Cancelled',
      subject: 'Cancellation Confirmation: {{booking_id}} - Kanha Residency',
      body: 'Namaste {{guest_name}},\n\nYour reservation {{booking_id}} for {{room_name}} has been cancelled as requested. Any eligible refunds have been initiated in accordance with our cancellation policy.\n\nWe hope to welcome you to Mathura in the future.\n\nKanha Residency',
      status: 'Active',
    },
  ];

  const coupons: Coupon[] = [
    {
      id: 'cpn_welcome10',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minimum_amount: 3000,
      maximum_discount: 1500,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      usage_limit: 500,
      times_used: 18,
      status: 'Active',
    },
    {
      id: 'cpn_mathura500',
      code: 'MATHURA500',
      type: 'fixed',
      value: 500,
      minimum_amount: 4000,
      maximum_discount: 500,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      usage_limit: 200,
      times_used: 42,
      status: 'Active',
    },
  ];

  const siteSettings: SiteSettings = {
    property_name: 'Kanha Residency',
    tagline: 'YOUR STAY, ELEVATED.',
    phone: '+91 79836 29114',
    email: 'reservations@kanharesidency.com',
    address: 'CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh',
    landmark: 'Near Techman Nilgiri, NH-19 Corridor',
    pincode: '281006',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    google_maps_url: 'https://www.google.com/maps/dir/23.7811896,86.408605/Kanha+Residency,+CMWM%2BRJX,+Techman+Nilgiri,+Mathura,+Uttar+Pradesh+281006/',
    tax_percentage: 12,
    service_charge: 0,
    cancellation_policy: 'Flexible',
    free_cancellation_hours: 48,
    hero_title: 'YOUR STAY,\nELEVATED.',
    hero_subtitle: 'A refined stay in the heart of Mathura.',
    hero_location: 'MATHURA · UTTAR PRADESH',
    hero_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85',
    about_title: 'Where Tranquil Comfort Meets Sacred Heritage',
    about_description: 'Situated in the revered cultural expanse of Mathura, Kanha Residency is envisioned as a sanctuary for modern travelers, pilgrims, and families seeking refined luxury with authentic Indian warmth. Experience spacious, light-filled rooms, pure vegetarian dining, and personalized darshan concierge services that transform your pilgrimage into an effortless memory.',
    social_links: {
      instagram: 'https://instagram.com/kanharesidency',
      facebook: 'https://facebook.com/kanharesidency',
      youtube: 'https://youtube.com/@kanharesidency',
    },
  };

  const auditLogs: AuditLog[] = [
    {
      id: 'aud_init_1',
      user_name: 'Executive Concierge Admin',
      user_role: 'Admin',
      action: 'SYSTEM_INITIALIZED',
      entity: 'System',
      entity_id: 'sys_root',
      timestamp: now,
      ip_address: '127.0.0.1',
    },
  ];

  const notifications: AdminNotification[] = [
    {
      id: 'notif_1',
      type: 'booking',
      title: 'New Confirmed Reservation',
      message: 'Booking KR20260425 confirmed for Rahul Sharma (Deluxe Room)',
      read: false,
      link: '/admin/bookings',
      created_at: now,
    },
  ];

  return {
    users,
    rooms,
    amenities,
    availability: [],
    bookings,
    payments,
    reviews,
    enquiries: [
      {
        id: 'enq_1',
        name: 'Meera Kapur',
        email: 'meera.k@gmail.com',
        phone: '+91 99201 44552',
        message: 'Namaste, we are planning a 4-day Vrindavan & Mathura parikrama tour for 8 elders in May. Do you provide temple transfers and satvik breakfast?',
        status: 'New',
        created_at: now,
      },
    ],
    gallery,
    emailTemplates,
    emailLogs: [
      {
        id: 'eml_1',
        recipient: 'rahul.sharma@example.com',
        subject: 'Confirmed: Your Stay at Kanha Residency (ID: KR20260425)',
        template_name: 'Booking Confirmed',
        status: 'Sent',
        sent_time: now,
        related_booking: 'KR20260425',
      },
    ],
    coupons,
    siteSettings,
    auditLogs,
    notifications,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to load db file, initializing defaults:', err);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users.map(({ passwordHash, salt, ...u }) => u);
  }

  findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    address?: string;
  }) {
    if (this.findUserByEmail(userData.email)) {
      throw new Error('An account with this email address already exists.');
    }
    const { hash, salt } = hashPassword(userData.password);
    const now = new Date().toISOString();
    const newUser: DatabaseSchema['users'][0] = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'Guest',
      status: 'Active',
      passwordHash: hash,
      salt,
      address: userData.address || '',
      created_at: now,
      updated_at: now,
    };
    this.data.users.push(newUser);
    this.saveData();
    const { passwordHash, salt: _, ...safeUser } = newUser;
    return safeUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>) {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.address) user.address = updates.address;
    user.updated_at = new Date().toISOString();
    this.saveData();
    const { passwordHash, salt, ...safe } = user;
    return safe;
  }

  // --- Rooms ---
  getRooms() {
    return this.data.rooms;
  }

  getRoomById(id: string) {
    return this.data.rooms.find((r) => r.id === id || r.slug === id);
  }

  createRoom(roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newRoom: Room = {
      ...roomData,
      id: `room_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    this.data.rooms.push(newRoom);
    this.saveData();
    return newRoom;
  }

  updateRoom(roomId: string, updates: Partial<Room>) {
    const idx = this.data.rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) throw new Error('Room not found');
    this.data.rooms[idx] = {
      ...this.data.rooms[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.rooms[idx];
  }

  deleteRoom(roomId: string) {
    const idx = this.data.rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) throw new Error('Room not found');
    this.data.rooms.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- Availability & Concurrency Lock ---
  checkRoomAvailability(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string) {
    const room = this.getRoomById(roomId);
    if (!room || room.status !== 'Active') return false;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || inDate >= outDate) {
      return false;
    }

    // Check manual blocked dates
    const isManuallyBlocked = this.data.availability.some(
      (a) =>
        a.room_id === roomId &&
        (a.status === 'blocked' || a.status === 'maintenance') &&
        new Date(a.date) >= inDate &&
        new Date(a.date) < outDate
    );
    if (isManuallyBlocked) return false;

    // Check overlapping bookings
    const overlappingBookings = this.data.bookings.filter((b) => {
      if (b.room_id !== roomId) return false;
      if (b.status === 'Cancelled' || b.status === 'No Show') return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;

      const bIn = new Date(b.check_in);
      const bOut = new Date(b.check_out);
      // Overlap formula: (StartA < EndB) and (EndA > StartB)
      return inDate < bOut && outDate > bIn;
    });

    const activeRoomsCount = overlappingBookings.reduce((sum, b) => sum + (b.rooms_count || 1), 0);
    return activeRoomsCount < (room.inventory_count || 1);
  }

  // --- Bookings ---
  getBookings() {
    return this.data.bookings.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getBookingById(id: string) {
    return this.data.bookings.find(
      (b) => b.id === id || b.booking_number.toUpperCase() === id.toUpperCase()
    );
  }

  getUserBookings(userId: string) {
    return this.data.bookings
      .filter((b) => b.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  calculatePricing(roomId: string, checkIn: string, checkOut: string, couponCode?: string) {
    const room = this.getRoomById(roomId);
    if (!room) throw new Error('Room not found');

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    const effectiveNightlyPrice = room.discount_price || room.price;
    const subtotal = effectiveNightlyPrice * nights;

    let discount = 0;
    if (couponCode) {
      const coupon = this.data.coupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.status === 'Active'
      );
      if (coupon && subtotal >= coupon.minimum_amount) {
        if (coupon.type === 'percentage') {
          discount = Math.min(coupon.maximum_discount, Math.round((subtotal * coupon.value) / 100));
        } else {
          discount = Math.min(coupon.maximum_discount, coupon.value);
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const taxRate = (this.data.siteSettings.tax_percentage || 12) / 100;
    const tax = Math.round(discountedSubtotal * taxRate);
    const total = discountedSubtotal + tax;

    return {
      roomId: room.id,
      roomName: room.name,
      nightlyPrice: effectiveNightlyPrice,
      nights,
      subtotal,
      discount,
      taxRatePercentage: this.data.siteSettings.tax_percentage,
      tax,
      total,
    };
  }

  createBooking(bookingPayload: {
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomsCount?: number;
    couponCode?: string;
    specialRequest?: string;
    policyConsent: Booking['policy_consent'];
    guest: Booking['guest'];
    paymentMethod: Booking['payment_method'];
  }) {
    // 1. Strict Server-Side Double Booking Check
    const isAvailable = this.checkRoomAvailability(
      bookingPayload.roomId,
      bookingPayload.checkIn,
      bookingPayload.checkOut
    );
    if (!isAvailable) {
      throw new Error('Sorry, this room is no longer available for the selected dates. Please choose different dates or another room.');
    }

    // 2. Server-side authoritative price recalculation
    const pricing = this.calculatePricing(
      bookingPayload.roomId,
      bookingPayload.checkIn,
      bookingPayload.checkOut,
      bookingPayload.couponCode
    );

    const room = this.getRoomById(bookingPayload.roomId)!;
    const now = new Date().toISOString();
    const dateStr = bookingPayload.checkIn.replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `KR${dateStr}${randSuffix}`;
    const bookingId = `bk_${Date.now()}`;

    const newBooking: Booking = {
      id: bookingId,
      booking_number: bookingNumber,
      user_id: bookingPayload.userId,
      room_id: room.id,
      room_name: room.name,
      room_image: room.featured_image,
      check_in: bookingPayload.checkIn,
      check_out: bookingPayload.checkOut,
      guests: bookingPayload.guests,
      rooms_count: bookingPayload.roomsCount || 1,
      nights: pricing.nights,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      discount: pricing.discount,
      total: pricing.total,
      status: 'Confirmed',
      payment_status: 'Paid', // verified upon successful gateway payment simulation
      payment_id: `pay_kr_${Date.now()}`,
      payment_method: bookingPayload.paymentMethod || 'UPI',
      special_request: bookingPayload.specialRequest || '',
      policy_consent: bookingPayload.policyConsent,
      guest: bookingPayload.guest,
      created_at: now,
      updated_at: now,
    };

    // Update coupon usage if applicable
    if (bookingPayload.couponCode) {
      const cIdx = this.data.coupons.findIndex(
        (c) => c.code.toUpperCase() === bookingPayload.couponCode!.toUpperCase()
      );
      if (cIdx !== -1) {
        this.data.coupons[cIdx].times_used = (this.data.coupons[cIdx].times_used || 0) + 1;
      }
    }

    this.data.bookings.unshift(newBooking);

    // Create payment ledger record
    const paymentRecord: PaymentRecord = {
      id: `pay_rec_${Date.now()}`,
      booking_id: newBooking.id,
      booking_number: newBooking.booking_number,
      guest_name: newBooking.guest.full_name,
      payment_id: newBooking.payment_id!,
      gateway: 'Razorpay',
      amount: newBooking.total,
      currency: 'INR',
      status: 'Success',
      transaction_reference: `${newBooking.payment_method}/AUTH/${Date.now().toString().slice(-8)}`,
      payment_method: newBooking.payment_method!,
      paid_at: now,
      created_at: now,
    };
    this.data.payments.unshift(paymentRecord);

    // Add Admin Notification
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'booking',
      title: 'New Confirmed Booking',
      message: `Reservation ${newBooking.booking_number} for ${newBooking.guest.full_name} (${newBooking.room_name}) - ₹${newBooking.total}`,
      read: false,
      link: '/admin/bookings',
      created_at: now,
    });

    // Auto-log confirmation email
    const emailBody = `Namaste ${newBooking.guest.full_name},

We are honored to confirm your reservation at Kanha Residency, Mathura.

RESERVATION DETAILS:
• Booking Reference: ${newBooking.booking_number}
• Reserved Suite: ${newBooking.room_name}
• Check-in: ${newBooking.check_in} (from 14:00)
• Check-out: ${newBooking.check_out} (until 11:00)
• Stay Duration: ${newBooking.nights} Night(s)
• Total Guests: ${newBooking.guests}
• Total Amount Paid: ₹${newBooking.total} (GST 12% included)
• Transaction Ref: ${paymentRecord.transaction_reference}

PILGRIMAGE CONCIERGE & LOCAL GUIDANCE:
• Shri Krishna Janmabhoomi: 10 mins (Morning Mangala Aarti: 05:30 AM)
• Dwarkadhish Temple & Vishram Ghat: Evening Yamuna Aarti at 07:00 PM
• Govardhan Parikrama: Pre-arranged private transport available upon request

PROPERTY ADDRESS:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006
Concierge Desk: +91 98970 12345 | reservations@kanharesidency.com

Warm regards & Jai Shri Krishna,
Kanha Residency Hospitality Team`;

    this.data.emailLogs.unshift({
      id: `eml_${Date.now()}`,
      recipient: newBooking.guest.email,
      subject: `Confirmed: Your Stay at Kanha Residency (ID: ${newBooking.booking_number})`,
      template_name: 'Booking Confirmed',
      status: 'Sent',
      sent_time: now,
      related_booking: newBooking.booking_number,
      body: emailBody,
    });

    // Audit log
    this.data.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      user_name: newBooking.guest.full_name,
      user_role: 'Guest',
      action: 'BOOKING_CREATED',
      entity: 'Booking',
      entity_id: newBooking.booking_number,
      new_value: `Room: ${newBooking.room_name}, Amount: ${newBooking.total}`,
      timestamp: now,
      ip_address: '127.0.0.1',
    });

    this.saveData();
    return newBooking;
  }

  updateBookingStatus(bookingId: string, status: Booking['status'], adminUser = 'Admin') {
    const b = this.data.bookings.find((item) => item.id === bookingId || item.booking_number === bookingId);
    if (!b) throw new Error('Booking not found');
    const oldStatus = b.status;
    b.status = status;
    b.updated_at = new Date().toISOString();

    this.data.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      user_name: adminUser,
      user_role: 'Admin',
      action: 'BOOKING_STATUS_CHANGED',
      entity: 'Booking',
      entity_id: b.booking_number,
      old_value: oldStatus,
      new_value: status,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1',
    });

    this.saveData();
    return b;
  }

  cancelBooking(bookingId: string, reason?: string, byUser = 'Guest') {
    const b = this.data.bookings.find((item) => item.id === bookingId || item.booking_number === bookingId);
    if (!b) throw new Error('Booking not found');
    if (b.status === 'Cancelled') throw new Error('Booking is already cancelled');

    b.status = 'Cancelled';
    b.updated_at = new Date().toISOString();

    // Trigger refund if paid
    if (b.payment_status === 'Paid') {
      b.payment_status = 'Refunded';
      const payment = this.data.payments.find((p) => p.booking_id === b.id || p.booking_number === b.booking_number);
      if (payment) {
        payment.status = 'Refunded';
        payment.refund = {
          refund_id: `ref_${Date.now()}`,
          amount: b.total,
          status: 'Completed',
          reason: reason || 'Guest requested cancellation within policy',
          processed_at: new Date().toISOString(),
        };
      }
    }

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'cancellation',
      title: 'Booking Cancelled',
      message: `Reservation ${b.booking_number} was cancelled (${byUser})`,
      read: false,
      link: '/admin/bookings',
      created_at: new Date().toISOString(),
    });

    const cancelBody = `Namaste ${b.guest.full_name},

Your reservation #${b.booking_number} for ${b.room_name} has been successfully cancelled as requested.

CANCELLATION SUMMARY:
• Booking Number: ${b.booking_number}
• Reserved Dates: ${b.check_in} to ${b.check_out}
• Refund Status: Initiated in full (₹${b.total}) to your original payment rail
• Refund Processing Time: 3-5 business days via standard banking partner

We hope to have the privilege of welcoming you to sacred Mathura in the future.

Warm regards,
Kanha Residency Reservations Desk
Phone: +91 98970 12345`;

    this.data.emailLogs.unshift({
      id: `eml_${Date.now()}`,
      recipient: b.guest.email,
      subject: `Cancellation Confirmation: ${b.booking_number} - Kanha Residency`,
      template_name: 'Booking Cancelled',
      status: 'Sent',
      sent_time: new Date().toISOString(),
      related_booking: b.booking_number,
      body: cancelBody,
    });

    this.saveData();
    return b;
  }

  // --- Payments & Refunds ---
  getPayments() {
    return this.data.payments;
  }

  processRefund(paymentId: string, amount: number, reason: string) {
    const payment = this.data.payments.find((p) => p.id === paymentId || p.payment_id === paymentId);
    if (!payment) throw new Error('Payment record not found');

    payment.status = 'Refunded';
    payment.refund = {
      refund_id: `ref_${Date.now()}`,
      amount,
      status: 'Completed',
      reason,
      processed_at: new Date().toISOString(),
    };

    const booking = this.data.bookings.find((b) => b.id === payment.booking_id || b.booking_number === payment.booking_number);
    if (booking) {
      booking.payment_status = 'Refunded';
      booking.status = 'Cancelled';
      booking.updated_at = new Date().toISOString();
    }

    this.saveData();
    return payment;
  }

  // --- Availability Management ---
  getAvailability() {
    return this.data.availability;
  }

  blockDates(roomId: string, dates: string[], status: 'blocked' | 'maintenance' = 'blocked', notes?: string) {
    for (const date of dates) {
      const existing = this.data.availability.find((a) => a.room_id === roomId && a.date === date);
      if (existing) {
        existing.status = status;
        existing.notes = notes;
      } else {
        this.data.availability.push({
          id: `av_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          room_id: roomId,
          date,
          status,
          notes,
        });
      }
    }
    this.saveData();
    return this.data.availability;
  }

  unblockDates(roomId: string, dates: string[]) {
    this.data.availability = this.data.availability.filter(
      (a) => !(a.room_id === roomId && dates.includes(a.date))
    );
    this.saveData();
    return this.data.availability;
  }

  // --- Reviews ---
  getReviews(includePending = false) {
    if (includePending) return this.data.reviews;
    return this.data.reviews.filter((r) => r.status === 'Approved');
  }

  addReview(reviewData: Omit<Review, 'id' | 'status' | 'created_at'>) {
    const now = new Date().toISOString();
    const newRev: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      status: 'Approved', // Auto-approved for verified guest experience in demo
      created_at: now,
    };
    this.data.reviews.unshift(newRev);

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'review',
      title: 'New Guest Review',
      message: `${newRev.user_name} rated ${newRev.room_name} ${newRev.rating}/5 stars`,
      read: false,
      link: '/admin/reviews',
      created_at: now,
    });

    this.saveData();
    return newRev;
  }

  updateReviewStatus(reviewId: string, status: Review['status']) {
    const rev = this.data.reviews.find((r) => r.id === reviewId);
    if (!rev) throw new Error('Review not found');
    rev.status = status;
    this.saveData();
    return rev;
  }

  // --- Enquiries ---
  getEnquiries() {
    return this.data.enquiries.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  createEnquiry(data: { name: string; email: string; phone: string; message: string }) {
    const now = new Date().toISOString();
    const newEnq: Enquiry = {
      id: `enq_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: 'New',
      created_at: now,
    };
    this.data.enquiries.unshift(newEnq);

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'enquiry',
      title: 'New Guest Enquiry',
      message: `Enquiry from ${newEnq.name} (${newEnq.phone})`,
      read: false,
      link: '/admin/enquiries',
      created_at: now,
    });

    // Confirmation email log
    const enqEmailBody = `Namaste ${newEnq.name},

Thank you for reaching out to Kanha Residency, Mathura.

We have safely received your enquiry regarding:
"${newEnq.message}"

Our dedicated pilgrim concierge and front desk team will contact you within 2-4 hours to assist with your itinerary, room reservations, temple timings, or special arrangements.

Property Coordinates:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, UP 281006
Concierge Line: +91 98970 12345
Email: reservations@kanharesidency.com

Warm regards & Radhe Radhe,
Guest Relations, Kanha Residency`;

    this.data.emailLogs.unshift({
      id: `eml_${Date.now()}`,
      recipient: newEnq.email,
      subject: 'We have received your enquiry - Kanha Residency Mathura',
      template_name: 'Enquiry Received',
      status: 'Sent',
      sent_time: now,
      body: enqEmailBody,
    });

    this.saveData();
    return newEnq;
  }

  updateEnquiryStatus(enquiryId: string, status: Enquiry['status'], notes?: string) {
    const enq = this.data.enquiries.find((e) => e.id === enquiryId);
    if (!enq) throw new Error('Enquiry not found');
    enq.status = status;
    if (notes) enq.admin_notes = notes;
    this.saveData();
    return enq;
  }

  // --- Gallery CMS ---
  getGallery() {
    return this.data.gallery.sort((a, b) => a.sort_order - b.sort_order);
  }

  addGalleryItem(item: Omit<GalleryItem, 'id'>) {
    const newItem: GalleryItem = {
      ...item,
      id: `gal_${Date.now()}`,
    };
    this.data.gallery.push(newItem);
    this.saveData();
    return newItem;
  }

  deleteGalleryItem(id: string) {
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    this.saveData();
    return true;
  }

  // --- Amenities ---
  getAmenities() {
    return this.data.amenities;
  }

  updateAmenity(id: string, updates: Partial<Amenity>) {
    const a = this.data.amenities.find((item) => item.id === id);
    if (!a) throw new Error('Amenity not found');
    Object.assign(a, updates);
    this.saveData();
    return a;
  }

  createAmenity(amenity: Omit<Amenity, 'id'>) {
    const newA: Amenity = {
      ...amenity,
      id: `amen_${Date.now()}`,
    };
    this.data.amenities.push(newA);
    this.saveData();
    return newA;
  }

  // --- Email Templates & Logs ---
  getEmailTemplates() {
    return this.data.emailTemplates;
  }

  updateEmailTemplate(id: string, updates: Partial<EmailTemplate>) {
    const tpl = this.data.emailTemplates.find((t) => t.id === id);
    if (!tpl) throw new Error('Template not found');
    Object.assign(tpl, updates);
    this.saveData();
    return tpl;
  }

  getEmailLogs() {
    return this.data.emailLogs;
  }

  recordEmailLog(log: EmailLog) {
    this.data.emailLogs.unshift(log);
    this.saveData();
    return log;
  }

  retryEmail(logId: string) {
    const log = this.data.emailLogs.find((l) => l.id === logId);
    if (!log) throw new Error('Email log not found');
    log.status = 'Sent';
    log.sent_time = new Date().toISOString();
    delete log.error;
    this.saveData();
    return log;
  }

  sendTestEmail(to: string, templateName = 'Booking Confirmed', customData?: any) {
    const now = new Date().toISOString();
    const guestName = customData?.guest_name || 'Shri Lucky Raj';
    const bookingId = customData?.booking_id || `KR${Math.floor(100000 + Math.random() * 900000)}`;
    const roomName = customData?.room_name || 'Deluxe Room';
    const total = customData?.total || 4480;

    let subject = `Confirmed: Your Stay at Kanha Residency (ID: ${bookingId})`;
    let body = `Namaste ${guestName},

We are delighted to confirm your upcoming reservation at Kanha Residency, Mathura.

RESERVATION SUMMARY:
• Booking ID: ${bookingId}
• Accommodation: ${roomName}
• Check-in: 14:00 onwards
• Check-out: 11:00 AM
• Rate: ₹${total} (GST 12% included)
• Status: Confirmed & Guaranteed

LOCAL PILGRIMAGE HIGHLIGHTS:
• Shri Krishna Janmabhoomi: 10 mins distance
• Vishram Ghat Evening Yamuna Aarti: 7:00 PM
• Pure Vegetarian & Sattvic In-Room Dining Available 24/7

Property Address:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, UP 281006
Concierge Line: +91 98970 12345

Warm regards,
Kanha Residency Concierge`;

    if (templateName === 'Booking Cancelled') {
      subject = `Cancellation Confirmation: ${bookingId} - Kanha Residency`;
      body = `Namaste ${guestName},\n\nYour reservation ${bookingId} has been cancelled as requested. Any eligible refunds have been initiated in accordance with our policy.\n\nWarm regards,\nKanha Residency Reservations Desk`;
    } else if (templateName === 'Welcome Email') {
      subject = `Welcome to Kanha Residency Circle, ${guestName}`;
      body = `Namaste ${guestName},\n\nWelcome to Kanha Residency, Mathura. We are delighted to accompany you on your spiritual retreat in sacred Braj Bhumi.\n\nKanha Residency Hospitality`;
    }

    const newLog: EmailLog = {
      id: `eml_${Date.now()}`,
      recipient: to || 'guest@example.com',
      subject,
      template_name: templateName,
      status: 'Sent',
      sent_time: now,
      related_booking: bookingId,
      body,
    };

    this.data.emailLogs.unshift(newLog);
    this.saveData();
    return newLog;
  }

  // --- Coupons ---
  getCoupons() {
    return this.data.coupons;
  }

  verifyCoupon(code: string, amount: number) {
    const coupon = this.data.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.status === 'Active'
    );
    if (!coupon) return { valid: false, message: 'Invalid or expired coupon code' };
    if (amount < coupon.minimum_amount) {
      return { valid: false, message: `Minimum booking amount of ₹${coupon.minimum_amount} required` };
    }
    const discount =
      coupon.type === 'percentage'
        ? Math.min(coupon.maximum_discount, Math.round((amount * coupon.value) / 100))
        : Math.min(coupon.maximum_discount, coupon.value);
    return { valid: true, coupon, discount };
  }

  createCoupon(coupon: Omit<Coupon, 'id' | 'times_used'>) {
    const newC: Coupon = {
      ...coupon,
      id: `cpn_${Date.now()}`,
      times_used: 0,
    };
    this.data.coupons.push(newC);
    this.saveData();
    return newC;
  }

  // --- Settings ---
  getSettings() {
    return this.data.siteSettings;
  }

  updateSettings(updates: Partial<SiteSettings>) {
    this.data.siteSettings = {
      ...this.data.siteSettings,
      ...updates,
    };
    this.saveData();
    return this.data.siteSettings;
  }

  // --- Notifications ---
  getNotifications() {
    return this.data.notifications;
  }

  markNotificationRead(id: string) {
    const n = this.data.notifications.find((item) => item.id === id);
    if (n) n.read = true;
    this.saveData();
    return n;
  }

  clearNotifications() {
    this.data.notifications = [];
    this.saveData();
    return true;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.data.auditLogs;
  }

  // --- CSV Export Utility ---
  exportCSV(type: 'bookings' | 'guests' | 'payments' | 'enquiries') {
    if (type === 'bookings') {
      const headers = ['Booking Number', 'Guest Name', 'Email', 'Phone', 'Room', 'Check In', 'Check Out', 'Nights', 'Guests', 'Subtotal', 'Tax', 'Discount', 'Total', 'Status', 'Payment Status', 'Created At'];
      const rows = this.data.bookings.map((b) => [
        b.booking_number,
        `"${b.guest.full_name}"`,
        b.guest.email,
        b.guest.phone,
        `"${b.room_name}"`,
        b.check_in,
        b.check_out,
        b.nights,
        b.guests,
        b.subtotal,
        b.tax,
        b.discount,
        b.total,
        b.status,
        b.payment_status,
        b.created_at,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
    if (type === 'payments') {
      const headers = ['Payment ID', 'Booking Number', 'Guest Name', 'Amount', 'Currency', 'Gateway', 'Payment Method', 'Status', 'Transaction Ref', 'Paid At'];
      const rows = this.data.payments.map((p) => [
        p.payment_id,
        p.booking_number,
        `"${p.guest_name}"`,
        p.amount,
        p.currency,
        p.gateway,
        p.payment_method,
        p.status,
        `"${p.transaction_reference}"`,
        p.paid_at,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
    if (type === 'enquiries') {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Created At'];
      const rows = this.data.enquiries.map((e) => [
        e.id,
        `"${e.name}"`,
        e.email,
        e.phone,
        `"${e.message.replace(/"/g, '""')}"`,
        e.status,
        e.created_at,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
    return '';
  }
}

export const db = new Database();
