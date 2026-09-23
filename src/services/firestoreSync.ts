import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { DEFAULT_ROOMS } from '../data/defaultRooms';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_AMENITIES,
  DEFAULT_COUPONS,
} from '../data/defaultData';
import type {
  Room,
  Booking,
  Review,
  Enquiry,
  GalleryItem,
  Amenity,
  Coupon,
  SiteSettings,
  PaymentRecord,
  AdminNotification,
} from '../types';

let isSeeded = false;

/**
 * Initializes Firestore collections with default verified luxury content if empty.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (isSeeded) return;
  isSeeded = true;

  try {
    // 1. Rooms
    const roomsSnap = await getDocs(collection(db, 'rooms'));
    if (roomsSnap.empty) {
      const batch = writeBatch(db);
      for (const room of DEFAULT_ROOMS) {
        batch.set(doc(db, 'rooms', room.id), room);
      }
      await batch.commit();
    }

    // 2. Settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS);
    }

    // 3. Gallery
    const gallerySnap = await getDocs(collection(db, 'gallery'));
    if (gallerySnap.empty) {
      const batch = writeBatch(db);
      for (const item of DEFAULT_GALLERY) {
        batch.set(doc(db, 'gallery', item.id), item);
      }
      await batch.commit();
    }

    // 4. Reviews
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    if (reviewsSnap.empty) {
      const batch = writeBatch(db);
      for (const rev of DEFAULT_REVIEWS) {
        batch.set(doc(db, 'reviews', rev.id), rev);
      }
      await batch.commit();
    }

    // 5. Amenities
    const amenitiesSnap = await getDocs(collection(db, 'amenities'));
    if (amenitiesSnap.empty) {
      const batch = writeBatch(db);
      for (const am of DEFAULT_AMENITIES) {
        batch.set(doc(db, 'amenities', am.id), am);
      }
      await batch.commit();
    }

    // 6. Coupons
    const couponsSnap = await getDocs(collection(db, 'coupons'));
    if (couponsSnap.empty) {
      const batch = writeBatch(db);
      for (const cpn of DEFAULT_COUPONS) {
        batch.set(doc(db, 'coupons', cpn.id), cpn);
      }
      await batch.commit();
    }
  } catch (err) {
    console.warn('Firestore initial seeding note:', err);
  }
}

// ----------------------------------------------------
// ROOMS
// ----------------------------------------------------
export async function getRoomsFromFirestore(): Promise<Room[]> {
  try {
    await seedFirestoreIfEmpty();
    const snap = await getDocs(collection(db, 'rooms'));
    if (snap.empty) return DEFAULT_ROOMS;
    const rooms: Room[] = [];
    snap.forEach((d) => rooms.push(d.data() as Room));
    return rooms.length > 0 ? rooms : DEFAULT_ROOMS;
  } catch (error) {
    console.warn('Firestore getRooms failed, using default data:', error);
    return DEFAULT_ROOMS;
  }
}

export async function saveRoomToFirestore(room: Room): Promise<void> {
  const path = `rooms/${room.id}`;
  try {
    await setDoc(doc(db, 'rooms', room.id), room, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ----------------------------------------------------
// BOOKINGS
// ----------------------------------------------------
export async function createBookingInFirestore(booking: Booking): Promise<Booking> {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
    // Also record payment record if paid
    if (booking.payment_status === 'Paid') {
      const payment: PaymentRecord = {
        id: `pay_${booking.id}`,
        booking_id: booking.id,
        booking_number: booking.booking_number,
        guest_name: booking.guest.full_name,
        payment_id: booking.payment_id || `PAY-${Date.now()}`,
        gateway: 'UPI_Direct',
        amount: booking.total,
        currency: 'INR',
        status: 'Success',
        transaction_reference: booking.payment_id || `TXN-${Date.now()}`,
        payment_method: 'UPI',
        paid_at: booking.created_at,
        created_at: booking.created_at,
      };
      await setDoc(doc(db, 'payments', payment.id), payment);
    }
    return booking;
  } catch (error) {
    console.warn('Firestore createBooking error:', error);
    return booking;
  }
}

export async function getBookingsFromFirestore(): Promise<Booking[]> {
  try {
    const snap = await getDocs(query(collection(db, 'bookings'), orderBy('created_at', 'desc')));
    const bookings: Booking[] = [];
    snap.forEach((d) => bookings.push(d.data() as Booking));
    return bookings;
  } catch (error) {
    console.warn('Firestore getBookings error:', error);
    return [];
  }
}

export async function updateBookingStatusInFirestore(id: string, status: Booking['status']): Promise<void> {
  const path = `bookings/${id}`;
  try {
    await updateDoc(doc(db, 'bookings', id), {
      status,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Firestore updateBookingStatus error:', error);
  }
}

// ----------------------------------------------------
// REVIEWS
// ----------------------------------------------------
export async function getReviewsFromFirestore(all = false): Promise<Review[]> {
  try {
    await seedFirestoreIfEmpty();
    const snap = await getDocs(collection(db, 'reviews'));
    const reviews: Review[] = [];
    snap.forEach((d) => {
      const rev = d.data() as Review;
      if (all || rev.status === 'Approved') {
        reviews.push(rev);
      }
    });
    return reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  } catch (error) {
    console.warn('Firestore getReviews error, using defaults:', error);
    return DEFAULT_REVIEWS;
  }
}

export async function createReviewInFirestore(review: Review): Promise<Review> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
    return review;
  } catch (error) {
    console.warn('Firestore createReview error:', error);
    return review;
  }
}

export async function updateReviewStatusInFirestore(id: string, status: Review['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'reviews', id), { status });
  } catch (error) {
    console.warn('Firestore updateReviewStatus error:', error);
  }
}

export async function deleteReviewFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    console.warn('Firestore deleteReview error:', error);
  }
}

// ----------------------------------------------------
// ENQUIRIES
// ----------------------------------------------------
export async function createEnquiryInFirestore(enquiry: Enquiry): Promise<Enquiry> {
  const path = `enquiries/${enquiry.id}`;
  try {
    await setDoc(doc(db, 'enquiries', enquiry.id), enquiry);
    return enquiry;
  } catch (error) {
    console.warn('Firestore createEnquiry error:', error);
    return enquiry;
  }
}

export async function getEnquiriesFromFirestore(): Promise<Enquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'enquiries'));
    const list: Enquiry[] = [];
    snap.forEach((d) => list.push(d.data() as Enquiry));
    return list;
  } catch (error) {
    console.warn('Firestore getEnquiries error:', error);
    return [];
  }
}

export async function updateEnquiryStatusInFirestore(id: string, status: Enquiry['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'enquiries', id), { status });
  } catch (error) {
    console.warn('Firestore updateEnquiryStatus error:', error);
  }
}

// ----------------------------------------------------
// GALLERY
// ----------------------------------------------------
export async function getGalleryFromFirestore(): Promise<GalleryItem[]> {
  try {
    await seedFirestoreIfEmpty();
    const snap = await getDocs(collection(db, 'gallery'));
    const items: GalleryItem[] = [];
    snap.forEach((d) => items.push(d.data() as GalleryItem));
    return items.length > 0 ? items : DEFAULT_GALLERY;
  } catch (error) {
    return DEFAULT_GALLERY;
  }
}

export async function addGalleryItemToFirestore(item: GalleryItem): Promise<GalleryItem> {
  try {
    await setDoc(doc(db, 'gallery', item.id), item);
    return item;
  } catch (error) {
    console.warn('Firestore addGalleryItem error:', error);
    return item;
  }
}

export async function deleteGalleryItemFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    console.warn('Firestore deleteGalleryItem error:', error);
  }
}

// ----------------------------------------------------
// AMENITIES & SETTINGS
// ----------------------------------------------------
export async function getAmenitiesFromFirestore(): Promise<Amenity[]> {
  try {
    await seedFirestoreIfEmpty();
    const snap = await getDocs(collection(db, 'amenities'));
    const list: Amenity[] = [];
    snap.forEach((d) => list.push(d.data() as Amenity));
    return list.length > 0 ? list : DEFAULT_AMENITIES;
  } catch (error) {
    return DEFAULT_AMENITIES;
  }
}

export async function getSettingsFromFirestore(): Promise<SiteSettings> {
  try {
    await seedFirestoreIfEmpty();
    const docSnap = await getDoc(doc(db, 'settings', 'global'));
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSettingsInFirestore(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
    const updated = await getDoc(doc(db, 'settings', 'global'));
    return updated.data() as SiteSettings;
  } catch (error) {
    console.warn('Firestore updateSettings error:', error);
    return { ...DEFAULT_SITE_SETTINGS, ...settings };
  }
}

// ----------------------------------------------------
// REAL-TIME SYNC LISTENERS
// ----------------------------------------------------
export function subscribeToBookings(onUpdate: (bookings: Booking[]) => void): () => void {
  try {
    const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const bookings: Booking[] = [];
        snapshot.forEach((d) => bookings.push(d.data() as Booking));
        onUpdate(bookings);
      },
      (error) => {
        console.warn('Live bookings sync error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
}

export function subscribeToEnquiries(onUpdate: (enquiries: Enquiry[]) => void): () => void {
  try {
    return onSnapshot(
      collection(db, 'enquiries'),
      (snapshot) => {
        const list: Enquiry[] = [];
        snapshot.forEach((d) => list.push(d.data() as Enquiry));
        onUpdate(list);
      },
      (error) => {
        console.warn('Live enquiries sync error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
}

export function subscribeToReviews(onUpdate: (reviews: Review[]) => void): () => void {
  try {
    return onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        const list: Review[] = [];
        snapshot.forEach((d) => {
          const rev = d.data() as Review;
          if (rev.status === 'Approved') list.push(rev);
        });
        onUpdate(list.length > 0 ? list : DEFAULT_REVIEWS);
      },
      (error) => {
        console.warn('Live reviews sync error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
}
