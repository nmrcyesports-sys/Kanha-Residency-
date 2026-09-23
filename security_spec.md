# Security Specification & Invariants for Kanha Residency

## 1. Data Invariants
1. **Rooms**: Publicly readable by guests and visitors. Write/update operations restricted to authorized staff/admins. Price and occupancy must be strictly positive numbers.
2. **Bookings**: Anyone can submit a new booking (public or signed-in guest). Guests can read their own bookings. Admins can view and manage all bookings. Status transitions are controlled.
3. **Reviews**: Approved reviews are public. Anyone can submit a review with rating between 1 and 5. Only admins can update review approval status or delete reviews.
4. **Enquiries**: Any site visitor can submit an inquiry. Only admins can read, list, update, or archive enquiries.
5. **Gallery, Amenities, Coupons, Settings**: Publicly readable so website visitors can view photos, amenities, discount coupons, and hotel contact details. Mutations restricted to administrators.
6. **Admin Authorization**: Verified via `/admins/{uid}` document existence or matching bootstrapped administrator email `luckyrajgupta1994@gmail.com`.

## 2. The Dirty Dozen Payloads
1. **Payload 1 (Ghost Field Injection on Booking)**: Injecting `{ "isAdmin": true, "status": "Confirmed" }` into a guest booking create request. Expected: REJECTED by strict schema keys.
2. **Payload 2 (Negative Room Price)**: Updating room price to `{ "price": -500 }`. Expected: REJECTED by numeric boundary validation.
3. **Payload 3 (Out-of-range Review Rating)**: Submitting a review with `{ "rating": 10 }` or `{ "rating": -1 }`. Expected: REJECTED by range constraint `[1, 5]`.
4. **Payload 4 (Non-Admin Room Creation)**: Unauthenticated visitor attempting to `create` a new room document. Expected: REJECTED with PERMISSION_DENIED.
5. **Payload 5 (Guest Reading Other Guest Bookings)**: Unauthenticated or non-admin user querying `/enquiries` or all private bookings. Expected: REJECTED.
6. **Payload 6 (Oversized Review Body DOS)**: Submitting a 5MB review string into `{ "review": "A".repeat(5000000) }`. Expected: REJECTED by `.size() <= 2000`.
7. **Payload 7 (Document ID Path Traversal / Poisoning)**: Writing to `/rooms/../../etc/passwd` or an ID > 128 characters. Expected: REJECTED by `isValidId`.
8. **Payload 8 (Unauthorized Review Approval)**: Normal guest attempting to update review status from `Pending` to `Approved`. Expected: REJECTED (only admin).
9. **Payload 9 (Forged Enquiry Status Modification)**: Visitor attempting to update an enquiry's status to `Resolved`. Expected: REJECTED.
10. **Payload 10 (Settings Tampering)**: Visitor attempting to modify payment UPI address or tax percentage in `/settings/global`. Expected: REJECTED.
11. **Payload 11 (Coupon Forgery)**: Guest creating a coupon with 100% discount. Expected: REJECTED.
12. **Payload 12 (Self-Assigned Admin Document)**: Unauthenticated user writing directly to `/admins/{uid}`. Expected: REJECTED.
