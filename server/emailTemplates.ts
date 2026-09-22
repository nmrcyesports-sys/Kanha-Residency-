import type { Booking, Enquiry, SiteSettings } from '../src/types';

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingConfirmedEmail(booking: Booking, settings?: SiteSettings | null) {
  const guest = booking.guest;
  const roomName = booking.room_name || 'Deluxe Room';
  const bookingNumber = booking.booking_number;
  const nights = booking.nights || 1;
  const guests = booking.guests || 2;
  const subtotal = booking.subtotal || Math.round(booking.total / 1.12);
  const tax = booking.tax || (booking.total - subtotal);
  const discount = booking.discount || 0;
  const total = booking.total;
  const checkIn = booking.check_in;
  const checkOut = booking.check_out;
  const paymentMethod = booking.payment_method || 'UPI';
  const paymentStatus = booking.payment_status || 'Paid';
  const paymentId = booking.payment_id || `PAY_KR_${booking.id.replace('bk_', '')}`;
  const checkInPin = bookingNumber.slice(-4);
  const hotelPhone = settings?.phone || '+91 98970 12345';
  const hotelEmail = settings?.email || 'reservations@kanharesidency.com';
  const hotelAddress = settings?.address || 'Techman Nilgiri, Near Highway City, Mathura, Uttar Pradesh 281006';
  const mapsUrl = settings?.google_maps_url || 'https://maps.google.com/?q=Kanha+Residency+Mathura';

  const subject = `Official Reservation Confirmation #${bookingNumber} — Kanha Residency, Mathura`;

  const text = `================================================================================
|| श्री कृष्णाय नमः ||
KANHA RESIDENCY — SACRED HOSPITALITY & HERITAGE SANCTUARY
Mathura, Uttar Pradesh, India
================================================================================

OFFICIAL DIGITAL RESERVATION VOUCHER
Booking Reference: ${bookingNumber}
Check-In Verification PIN: ${checkInPin}
Status: CONFIRMED & GUARANTEED
Payment: ${paymentStatus} via ${paymentMethod} (${formatCurrencyINR(total)})

--------------------------------------------------------------------------------
DEAR ${guest.full_name.toUpperCase()},

Radhe Radhe & Namaste. 
We have the distinct honor of confirming your reservation at Kanha Residency.
Our concierge team is devoted to making your pilgrimage to Mathura and Vrindavan 
serene, spiritually uplifting, and deeply comfortable.

--------------------------------------------------------------------------------
1. RESERVATION SPECIFICATIONS
--------------------------------------------------------------------------------
• Primary Guest: ${guest.full_name}
• Contact Mobile: ${guest.phone || 'N/A'}
• Email: ${guest.email}
• Reserved Suite: ${roomName}
• Check-In: ${checkIn} (Guaranteed Room Access from 14:00 PM)
• Check-Out: ${checkOut} (Until 11:00 AM)
• Stay Duration: ${nights} Night(s)
• Total Pilgrims: ${guests} Guest(s)
• Special Requests: ${booking.special_request || 'None Specified'}
• Meal Inclusions: 24/7 Pure Satvik Dining & Tea Service available

--------------------------------------------------------------------------------
2. ITEMIZED TARIFF & TAX STATEMENT
--------------------------------------------------------------------------------
• Base Suite Charges (${nights} night(s)): ${formatCurrencyINR(subtotal + discount)}
• Pilgrim Privilege Discount: -${formatCurrencyINR(discount)}
• Net Taxable Value: ${formatCurrencyINR(subtotal)}
• Goods & Services Tax (GST 12%): ${formatCurrencyINR(tax)}
--------------------------------------------------------------------------------
• TOTAL AUTHORIZED AMOUNT PAID: ${formatCurrencyINR(total)}
• Payment Mode: ${paymentMethod}
• Gateway Authorization ID: ${paymentId}
• Payment Status: ${paymentStatus.toUpperCase()}

--------------------------------------------------------------------------------
3. SACRED BRAJ PILGRIMAGE DARSHAN TIMINGS & CONCIERGE GUIDE
--------------------------------------------------------------------------------
1. SHRI KRISHNA JANMABHOOMI (10 Minutes Distance):
   - Morning Mangala Aarti: 05:30 AM
   - Shringar Aarti: 08:00 AM
   - Evening Sandhya Aarti: 07:30 PM
   * Note: Mobile phones, bags, and smartwatches are strictly restricted inside
     temple premises. Kanha Residency provides complimentary private electronic
     lockers at the front desk before you depart for darshan.

2. DWARKADHISH TEMPLE & VISHRAM GHAT (12 Minutes Distance):
   - Morning Darshan: 06:30 AM – 10:30 AM
   - Evening Maha Yamuna Aarti: 07:00 PM (Daily)
   * Front desk provides VIP wooden boat booking for Yamuna Aarti upon request.

3. VRINDAVAN & BANKE BIHARI JI (25 Minutes Drive):
   - Morning Darshan: 07:45 AM – 12:00 PM
   - Evening Darshan: 05:30 PM – 09:30 PM
   * Pre-arranged AC cabs and certified temple guides available via concierge.

4. GOVARDHAN DHAM PARIKRAMA & BARSANA:
   - 21 km Sacred Govardhan Parikrama (E-rickshaw & Private AC Cab options).
   - Advance booking recommended at the front desk with 2 hours notice.

--------------------------------------------------------------------------------
4. COMPLIMENTARY SANCTUARY INCLUSIONS & AMENITIES
--------------------------------------------------------------------------------
✓ Traditional Braj Welcome Drink & Fresh Mathura Peda on arrival
✓ 100% Pure Satvik & Jain-friendly kitchen (Strictly zero onion & zero garlic upon request)
✓ High-Speed Fiber Wi-Fi across all suites and common areas
✓ RO Mineral Purified Drinking Water
✓ 24/7 Instant Hot Water & Uninterrupted Power Backup
✓ Safe Luggage Cloakroom for early arrivals or post-checkout darshan tours
✓ Dedicated Secure Car Parking on premises with driver rest area

--------------------------------------------------------------------------------
5. ESSENTIAL CHECK-IN INSTRUCTIONS
--------------------------------------------------------------------------------
• Government Photo ID: Mandatory for all adult guests (Aadhaar, Passport, Voter ID, or DL).
• Sacred Atmosphere: Kanha Residency is strictly vegetarian, non-smoking, and alcohol-free.
• Early Check-in / Late Check-out: Subject to availability; please notify us 24h prior.

--------------------------------------------------------------------------------
6. PROPERTY LOCATION & 24/7 HELPLINE
--------------------------------------------------------------------------------
Kanha Residency
${hotelAddress}
Landmark: Near Highway City / Techman Nilgiri, Mathura
Front Desk Helpline (24/7): ${hotelPhone}
WhatsApp Concierge: ${hotelPhone}
Reservations Email: ${hotelEmail}
Google Maps Navigation: ${mapsUrl}

Warmest regards & Jai Shri Krishna,
The Hospitality & Concierge Directorate
Kanha Residency Mathura
================================================================================`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Reservation Confirmation — Kanha Residency Mathura</title>
  <style>
    /* Reset & Base */
    body, p, h1, h2, h3, h4, table, td { margin: 0; padding: 0; }
    body {
      background-color: #0B0C0E;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FAF7F2;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
      padding: 24px 12px;
    }
    .wrapper {
      max-width: 680px;
      margin: 0 auto;
      background-color: #131418;
      border: 1px solid #2D2720;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    /* Header */
    .top-invocation {
      background-color: #0E0F12;
      padding: 12px 24px;
      text-align: center;
      font-size: 11px;
      letter-spacing: 0.28em;
      color: #C5A880;
      font-weight: 600;
      text-transform: uppercase;
      border-bottom: 1px solid #231E18;
    }
    .header-banner {
      background: linear-gradient(180deg, #1C1E26 0%, #131418 100%);
      padding: 36px 32px 28px 32px;
      text-align: center;
      border-bottom: 2px solid #C5A880;
    }
    .brand-crown {
      display: inline-block;
      width: 44px;
      height: 44px;
      line-height: 44px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(197, 168, 128, 0.25) 0%, rgba(197, 168, 128, 0.05) 70%);
      border: 1.5px solid #C5A880;
      color: #E5C79E;
      font-size: 20px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      color: #FAF7F2;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }
    .brand-subtitle {
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #C5A880;
      font-weight: 500;
    }
    /* Status Pass */
    .pass-container {
      margin: 24px 32px 0 32px;
      background: linear-gradient(135deg, #1A1D25 0%, #15171E 100%);
      border: 1px solid #383025;
      border-radius: 16px;
      padding: 20px 24px;
    }
    .pass-badge {
      display: inline-block;
      background-color: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #4ade80;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .pass-num-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #9E9486;
    }
    .pass-num-value {
      font-family: 'SF Mono', Menlo, Consolas, Monaco, monospace;
      font-size: 24px;
      font-weight: 700;
      color: #FAF7F2;
      letter-spacing: 0.08em;
    }
    .pass-pin {
      display: inline-block;
      margin-top: 6px;
      font-size: 12px;
      color: #C5A880;
      background: rgba(197, 168, 128, 0.12);
      border: 1px dashed rgba(197, 168, 128, 0.35);
      padding: 3px 10px;
      border-radius: 6px;
    }
    /* Content */
    .main-body {
      padding: 32px;
    }
    .salutation {
      font-size: 20px;
      font-weight: 600;
      color: #FAF7F2;
      margin-bottom: 12px;
    }
    .intro-paragraph {
      font-size: 14.5px;
      color: #C7BFA2;
      line-height: 1.65;
      margin-bottom: 28px;
    }
    /* Section Cards */
    .section-card {
      background-color: #171920;
      border: 1px solid #28241D;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section-heading {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #E5C79E;
      margin-bottom: 18px;
      border-bottom: 1px solid #24201A;
      padding-bottom: 10px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }
    .data-table td {
      padding: 8px 0;
      vertical-align: top;
      border-bottom: 1px solid #201E19;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-label {
      color: #8C8477;
      width: 38%;
    }
    .data-val {
      color: #FAF7F2;
      font-weight: 600;
      text-align: right;
    }
    /* Financial Highlights */
    .total-highlight-row td {
      border-top: 1.5px dashed #C5A880 !important;
      padding-top: 14px !important;
      padding-bottom: 14px !important;
      font-size: 17px !important;
    }
    .total-highlight-val {
      color: #E5C79E !important;
      font-size: 22px !important;
      font-weight: 800 !important;
    }
    /* Pilgrimage Guidance */
    .guide-item {
      padding: 12px 0;
      border-bottom: 1px solid #22201B;
    }
    .guide-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .guide-title {
      font-size: 14px;
      font-weight: 700;
      color: #FAF7F2;
      margin-bottom: 4px;
    }
    .guide-detail {
      font-size: 12.5px;
      color: #A8A092;
      line-height: 1.55;
    }
    /* Inclusions grid */
    .inclusion-pill {
      display: inline-block;
      background-color: #1E2028;
      border: 1px solid #2C2822;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      color: #D8CFBF;
      margin: 4px;
    }
    /* Actions */
    .action-btn-row {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .action-btn {
      display: inline-block;
      background: linear-gradient(135deg, #C5A880 0%, #B39268 100%);
      color: #121316 !important;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 9999px;
      margin: 6px 8px;
      box-shadow: 0 4px 15px rgba(197, 168, 128, 0.3);
    }
    .action-btn-outline {
      display: inline-block;
      background-color: #1A1C22;
      color: #C5A880 !important;
      border: 1px solid #3D352B;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 13px 26px;
      border-radius: 9999px;
      margin: 6px 8px;
    }
    /* Footer */
    .footer {
      background-color: #0E0F12;
      border-top: 1px solid #221F1A;
      padding: 28px 32px;
      text-align: center;
      font-size: 11.5px;
      color: #6E685F;
      line-height: 1.7;
    }
    .footer a {
      color: #C5A880;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Top Sanskrit Invocation -->
    <div class="top-invocation">
      || श्री कृष्णाय नमः · Radhe Radhe ||
    </div>

    <!-- Header Banner -->
    <div class="header-banner">
      <div class="brand-crown">⚜</div>
      <h1 class="brand-title">Kanha Residency</h1>
      <p class="brand-subtitle">Sacred Hospitality & Heritage Sanctuary · Mathura</p>
    </div>

    <!-- Digital Reservation Pass -->
    <div class="pass-container">
      <table style="width: 100%;">
        <tr>
          <td>
            <div class="pass-badge">✓ Guaranteed & Confirmed</div>
            <div class="pass-num-label">Official Booking Reference</div>
            <div class="pass-num-value">${bookingNumber}</div>
            <div class="pass-pin">Quick Check-in Keycode: <strong>${checkInPin}</strong></div>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <div style="background-color: #0E0F12; border: 1px solid #332E27; border-radius: 10px; padding: 10px; display: inline-block; text-align: center;">
              <div style="font-size: 28px;">🛈</div>
              <div style="font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #C5A880; margin-top: 4px;">PASS VERIFIED</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="main-body">
      <!-- Personalized Greeting -->
      <div class="salutation">Namaste ${guest.full_name},</div>
      <p class="intro-paragraph">
        We are blessed and deeply honored to welcome you to <strong>Kanha Residency, Mathura</strong>. 
        Your reservation has been authoritatively secured in our central guest ledger. Our hospitality associates and temple concierge desk are already orchestrating your arrival to ensure your pilgrimage in sacred Braj Bhumi is peaceful, rejuvenating, and spiritually memorable.
      </p>

      <!-- Card 1: Reservation Specifications -->
      <div class="section-card">
        <div class="section-heading">1. Reservation & Suite Specifications</div>
        <table class="data-table">
          <tr>
            <td class="data-label">Primary Guest</td>
            <td class="data-val">${guest.full_name}</td>
          </tr>
          <tr>
            <td class="data-label">Reserved Suite</td>
            <td class="data-val" style="color: #E5C79E;">${roomName}</td>
          </tr>
          <tr>
            <td class="data-label">Check-In Schedule</td>
            <td class="data-val">${checkIn} (From 14:00 PM onwards)</td>
          </tr>
          <tr>
            <td class="data-label">Check-Out Schedule</td>
            <td class="data-val">${checkOut} (Until 11:00 AM)</td>
          </tr>
          <tr>
            <td class="data-label">Stay Duration</td>
            <td class="data-val">${nights} Night(s)</td>
          </tr>
          <tr>
            <td class="data-label">Total Pilgrims</td>
            <td class="data-val">${guests} Guest(s)</td>
          </tr>
          <tr>
            <td class="data-label">Special Requests</td>
            <td class="data-val" style="font-weight: normal; color: #D8CFBF;">${booking.special_request || 'Standard luxury setup requested'}</td>
          </tr>
        </table>
      </div>

      <!-- Card 2: Financial & Tax Statement -->
      <div class="section-card">
        <div class="section-heading">2. Official Tariff & Tax Statement</div>
        <table class="data-table">
          <tr>
            <td class="data-label">Suite Tariff (${nights} Nights)</td>
            <td class="data-val">${formatCurrencyINR(subtotal + discount)}</td>
          </tr>
          ${discount > 0 ? `
          <tr>
            <td class="data-label">Pilgrim Privilege Discount</td>
            <td class="data-val" style="color: #4ade80;">-${formatCurrencyINR(discount)}</td>
          </tr>` : ''}
          <tr>
            <td class="data-label">Taxable Value</td>
            <td class="data-val">${formatCurrencyINR(subtotal)}</td>
          </tr>
          <tr>
            <td class="data-label">Goods & Services Tax (GST 12%)</td>
            <td class="data-val">${formatCurrencyINR(tax)}</td>
          </tr>
          <tr class="total-highlight-row">
            <td class="data-label" style="color: #FAF7F2; font-weight: 700;">Grand Total Authorized</td>
            <td class="data-val total-highlight-val">${formatCurrencyINR(total)}</td>
          </tr>
          <tr>
            <td class="data-label">Payment Mode & Status</td>
            <td class="data-val" style="color: #4ade80;">${paymentMethod} · ${paymentStatus.toUpperCase()}</td>
          </tr>
          <tr>
            <td class="data-label">Transaction Ref ID</td>
            <td class="data-val" style="font-family: monospace; font-size: 12px; color: #9E9486;">${paymentId}</td>
          </tr>
        </table>
      </div>

      <!-- Card 3: Pilgrimage Concierge & Darshan Timings -->
      <div class="section-card">
        <div class="section-heading">3. Sacred Braj Darshan Guide & Temple Timings</div>
        <div class="guide-item">
          <div class="guide-title">🏛️ Shri Krishna Janmabhoomi Complex (10 mins distance)</div>
          <div class="guide-detail">
            <strong>Mangala Aarti:</strong> 05:30 AM · <strong>Shringar Aarti:</strong> 08:00 AM · <strong>Sandhya Aarti:</strong> 07:30 PM<br/>
            <em>Important Notice:</em> Mobile devices, leather goods, and bags are prohibited inside the shrine. Kanha Residency provides complimentary private digital safety lockers at our reception prior to your temple transfer.
          </div>
        </div>

        <div class="guide-item">
          <div class="guide-title">🛕 Dwarkadhish Temple & Sacred Vishram Ghat (12 mins distance)</div>
          <div class="guide-detail">
            <strong>Yamuna Evening Maha Aarti:</strong> 07:00 PM Daily.<br/>
            Traditional wooden boat rides for Yamuna Aarti can be reserved in advance at our concierge desk.
          </div>
        </div>

        <div class="guide-item">
          <div class="guide-title">🌸 Vrindavan & Shri Banke Bihari Ji (25 mins drive)</div>
          <div class="guide-detail">
            <strong>Morning Darshan:</strong> 07:45 AM – 12:00 PM · <strong>Evening Darshan:</strong> 05:30 PM – 09:30 PM.<br/>
            Private chauffeured AC vehicles with experienced local drivers are available on demand.
          </div>
        </div>

        <div class="guide-item">
          <div class="guide-title">⛰️ Govardhan Dham & Radha Kund Parikrama</div>
          <div class="guide-detail">
            Full 21 km Govardhan Parikrama arrangements (Air-conditioned vehicles or certified E-rickshaw permits) can be arranged with 2 hours advance notice at reception.
          </div>
        </div>
      </div>

      <!-- Card 4: Sanctuary Inclusions -->
      <div class="section-card">
        <div class="section-heading">4. Complimentary Guest Amenities & Privileges</div>
        <div style="margin-top: 8px;">
          <span class="inclusion-pill">🥛 Traditional Braj Thandai on Arrival</span>
          <span class="inclusion-pill">🍬 Fresh Mathura Peda Welcome</span>
          <span class="inclusion-pill">🍲 24/7 Pure Satvik In-Room Dining</span>
          <span class="inclusion-pill">📶 High-Speed Fiber Wi-Fi</span>
          <span class="inclusion-pill">💧 Pure RO Mineral Drinking Water</span>
          <span class="inclusion-pill">🚿 24/7 Geyser Hot Water & Backup</span>
          <span class="inclusion-pill">🚗 Free Private Secure Parking</span>
          <span class="inclusion-pill">🧳 Luggage Cloakroom for Early Arrivals</span>
        </div>
      </div>

      <!-- Card 5: Important Guidelines -->
      <div class="section-card">
        <div class="section-heading">5. Important Check-In Guidelines</div>
        <p style="font-size: 13px; color: #B3AAA0; line-height: 1.6;">
          • <strong>Mandatory Identification:</strong> Government photo ID (Aadhaar Card, Voter Card, Passport, or Driving License) is mandatory for every guest upon arrival.<br/>
          • <strong>Sacred Ambience:</strong> In respect of the spiritual sanctity of Mathura, our entire property is strictly pure vegetarian, alcohol-free, and 100% smoke-free.<br/>
          • <strong>Luggage Concierge:</strong> Arriving early for morning Janmabhoomi darshan? Our front desk team will happily store your luggage in our private cloakroom while you visit the temples.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="action-btn-row">
        <a href="${mapsUrl}" class="action-btn" target="_blank">📍 Directions on Google Maps</a>
        <a href="tel:${hotelPhone.replace(/\s+/g, '')}" class="action-btn-outline">📞 Call Concierge Desk</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <strong>Kanha Residency Mathura</strong><br/>
      ${hotelAddress}<br/>
      Concierge Helpline: ${hotelPhone} · Email: ${hotelEmail}<br/>
      GSTIN: 09AAAFK1234F1Z8 · Registered under Uttar Pradesh Tourism Board<br/>
      © ${new Date().getFullYear()} Kanha Residency Mathura. All rights reserved.
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

export function generateBookingCancelledEmail(booking: Booking, settings?: SiteSettings | null) {
  const guest = booking.guest;
  const bookingNumber = booking.booking_number;
  const roomName = booking.room_name;
  const total = booking.total;
  const checkIn = booking.check_in;
  const checkOut = booking.check_out;
  const hotelPhone = settings?.phone || '+91 98970 12345';
  const refundId = `REF_KR_${Date.now().toString().slice(-6)}`;

  const subject = `Reservation Cancellation & Refund Voucher #${bookingNumber} — Kanha Residency`;

  const text = `================================================================================
KANHA RESIDENCY — SACRED HOSPITALITY & HERITAGE SANCTUARY
Mathura, Uttar Pradesh, India
================================================================================

OFFICIAL CANCELLATION & REFUND STATEMENT
Booking Reference: ${bookingNumber}
Refund Reference: ${refundId}
Status: CANCELLED & REFUND PROCESSED

--------------------------------------------------------------------------------
DEAR ${guest.full_name.toUpperCase()},

We confirm that your reservation #${bookingNumber} for ${roomName} (${checkIn} to ${checkOut})
has been cancelled as requested.

REFUND SUMMARY:
• Original Total Paid: ${formatCurrencyINR(total)}
• Cancellation Fee (Flexible Sacred Pilgrimage Policy): ₹0 (No Penalty)
• Total Refund Amount Approved: ${formatCurrencyINR(total)}
• Refund Mode: Original Payment Method (${booking.payment_method || 'Online'})
• Processing Timeline: 3 to 5 business days reflecting directly in your bank account

PILGRIM RETURN PRIVILEGE:
We understand spiritual journeys often require flexible timelines. When you reschedule 
your holy visit to Mathura, use special promo code "BRAJDARSHAN10" for an exclusive 
10% privileged pilgrim rate.

Front Desk Concierge (24/7): ${hotelPhone}
Warm regards,
Kanha Residency Reservations Desk
================================================================================`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background-color: #0B0C0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FAF7F2; padding: 24px 12px; margin: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background-color: #131418; border: 1px solid #2D2720; border-radius: 18px; overflow: hidden; }
    .banner { background: #1C1E26; padding: 32px 24px; text-align: center; border-bottom: 2px solid #e11d48; }
    .title { font-family: Georgia, serif; font-size: 28px; color: #FAF7F2; margin: 0; }
    .body { padding: 32px 28px; }
    .card { background-color: #171920; border: 1px solid #28241D; border-radius: 12px; padding: 20px; margin: 20px 0; font-size: 13.5px; }
    .row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #221F1A; }
    .row:last-child { border-bottom: none; }
    .badge { display: inline-block; background-color: rgba(225, 29, 72, 0.15); color: #fb7185; border: 1px solid rgba(225, 29, 72, 0.3); font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .voucher-box { background: rgba(197, 168, 128, 0.1); border: 1px dashed #C5A880; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
    .footer { background-color: #0E0F12; padding: 24px; text-align: center; font-size: 11.5px; color: #6E685F; border-top: 1px solid #221F1A; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="banner">
      <div class="badge">Cancellation & Refund Notice</div>
      <h1 class="title">Kanha Residency</h1>
      <p style="font-size: 12px; color: #C5A880; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 6px;">Mathura, Uttar Pradesh</p>
    </div>
    <div class="body">
      <h2 style="font-size: 18px; margin-bottom: 10px;">Namaste ${guest.full_name},</h2>
      <p style="font-size: 14px; color: #C7BFA2; line-height: 1.6;">
        Your reservation cancellation has been formally processed. As per our <strong>Flexible Sacred Pilgrimage Policy</strong>, a full refund has been initiated to your original payment account.
      </p>

      <div class="card">
        <div style="font-size: 11px; font-weight: 700; color: #C5A880; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Refund Ledger Details</div>
        <div class="row"><span style="color: #8C8477;">Booking Reference:</span><span style="font-weight: 700;">${bookingNumber}</span></div>
        <div class="row"><span style="color: #8C8477;">Refund Reference:</span><span style="font-weight: 700; font-family: monospace;">${refundId}</span></div>
        <div class="row"><span style="color: #8C8477;">Cancelled Suite:</span><span>${roomName} (${checkIn} to ${checkOut})</span></div>
        <div class="row"><span style="color: #8C8477;">Original Amount Paid:</span><span>${formatCurrencyINR(total)}</span></div>
        <div class="row"><span style="color: #8C8477;">Cancellation Fee:</span><span style="color: #4ade80;">₹0 (Zero Deduction)</span></div>
        <div class="row" style="border-top: 1px dashed #C5A880; padding-top: 10px; font-size: 16px;"><span style="font-weight: 700;">Refund Credited:</span><span style="color: #4ade80; font-weight: 800;">${formatCurrencyINR(total)}</span></div>
      </div>

      <div class="voucher-box">
        <div style="font-size: 11px; color: #C5A880; text-transform: uppercase; font-weight: 700; letter-spacing: 0.15em;">Return Pilgrim Privileged Rate</div>
        <div style="font-size: 18px; font-weight: 700; color: #FAF7F2; margin: 8px 0; font-family: monospace;">PROMO CODE: BRAJDARSHAN10</div>
        <p style="font-size: 12px; color: #A8A092; margin: 0;">Enjoy 10% off your accommodations when you next plan your pilgrimage to Mathura.</p>
      </div>

      <p style="font-size: 13px; color: #8C8477; text-align: center; margin-top: 24px;">
        Need assistance or alternate dates? Contact our 24/7 Concierge at <a href="tel:${hotelPhone}" style="color: #C5A880;">${hotelPhone}</a>.
      </p>
    </div>
    <div class="footer">
      Kanha Residency, Techman Nilgiri, Mathura, UP 281006 · © ${new Date().getFullYear()}
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

export function generateEnquiryReceivedEmail(enquiry: Enquiry, settings?: SiteSettings | null) {
  const hotelPhone = settings?.phone || '+91 98970 12345';
  const hotelEmail = settings?.email || 'reservations@kanharesidency.com';
  const enquiryRef = `ENQ_KR_${Date.now().toString().slice(-6)}`;

  const subject = `Received: Your Pilgrimage Enquiry (${enquiryRef}) — Kanha Residency Mathura`;

  const text = `================================================================================
KANHA RESIDENCY — SACRED HOSPITALITY & HERITAGE SANCTUARY
Mathura, Uttar Pradesh, India
================================================================================

PILGRIMAGE ENQUIRY RECEIPT #${enquiryRef}

Namaste ${enquiry.name},

Thank you for reaching out to Kanha Residency, Mathura.
We have received your enquiry regarding your upcoming pilgrimage to Braj Bhumi:

YOUR QUERY:
"${enquiry.message}"

Dates of Interest: ${enquiry.dates || 'Flexible'}
Guests Count: ${enquiry.guests || 2}

WHAT HAPPENS NEXT:
Our dedicated Pilgrimage Hospitality Coordinator has been assigned to your request 
and will reach out via phone (${enquiry.phone || 'provided number'}) or email (${enquiry.email}) 
within 2 hours with customized suite options, temple darshan arrangements, and festive itinerary guides.

Immediate Assistance (24/7): ${hotelPhone}
Official Email: ${hotelEmail}

Warm regards & Jai Shri Krishna,
Kanha Residency Concierge Desk
================================================================================`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background-color: #0B0C0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FAF7F2; padding: 24px 12px; margin: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #131418; border: 1px solid #2D2720; border-radius: 18px; overflow: hidden; }
    .banner { background: #1C1E26; padding: 28px 24px; text-align: center; border-bottom: 2px solid #C5A880; }
    .body { padding: 32px 28px; font-size: 14px; line-height: 1.6; }
    .query-box { background-color: #181920; border-left: 3px solid #C5A880; border-radius: 0 10px 10px 0; padding: 16px 20px; font-style: italic; color: #D8CFBF; margin: 18px 0; }
    .footer { background-color: #0E0F12; padding: 20px; text-align: center; font-size: 11px; color: #6E685F; border-top: 1px solid #221F1A; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="banner">
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FAF7F2; margin: 0;">Kanha Residency</h1>
      <p style="font-size: 11px; color: #C5A880; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px;">Pilgrimage Concierge Desk · Mathura</p>
    </div>
    <div class="body">
      <h2 style="font-size: 18px; margin-bottom: 8px;">Namaste ${enquiry.name},</h2>
      <p style="color: #C7BFA2;">
        Thank you for contacting Kanha Residency. Your enquiry has been registered under reference <strong>${enquiryRef}</strong>.
      </p>

      <div class="query-box">
        "${enquiry.message}"
      </div>

      <p style="color: #FAF7F2; font-weight: 600; margin-top: 20px;">Dedicated Concierge Assignment:</p>
      <p style="font-size: 13px; color: #A8A092;">
        Our Senior Hospitality Manager has been assigned to your travel plans and will contact you directly via phone or email shortly with availability, customized temple darshan schedules, and vehicle transfer rates.
      </p>

      <div style="text-align: center; margin-top: 28px;">
        <a href="tel:${hotelPhone}" style="display: inline-block; background-color: #C5A880; color: #121316; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; padding: 12px 24px; border-radius: 9999px;">
          Call Concierge Directly (${hotelPhone})
        </a>
      </div>
    </div>
    <div class="footer">
      Kanha Residency Mathura · reservations@kanharesidency.com
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}
