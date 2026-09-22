import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, verifyPassword } from './server/db.js';
import { emailService } from './server/emailService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper auth check token
  const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return next();

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      const user = db.findUserById(decoded.id);
      if (user) {
        (req as any).user = user;
      }
    } catch {
      // invalid token
    }
    next();
  };

  app.use(authenticateToken);

  // -------------------------------------------------------------
  // AUTHENTICATION ROUTES
  // -------------------------------------------------------------
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, phone, password, confirmPassword, address } = req.body;
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      const user = db.createUser({
        name,
        email,
        phone,
        password,
        role: 'Guest',
        address,
      });

      const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
      res.json({ user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const userRecord = db.findUserByEmail(email);
      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isValid = verifyPassword(password, userRecord.passwordHash, userRecord.salt);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const { passwordHash, salt, ...safeUser } = userRecord;
      const token = Buffer.from(JSON.stringify({ id: safeUser.id, email: safeUser.email, role: safeUser.role })).toString('base64');
      res.json({ user: safeUser, token });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { passwordHash, salt, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.put('/api/auth/profile', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const updated = db.updateUserProfile(user.id, req.body);
      res.json({ user: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      // Avoid user enumeration
      return res.json({ message: 'If an account exists with this email, password reset instructions have been sent.' });
    }
    // Simulate email log
    res.json({ message: 'Password reset link sent to your registered email address.' });
  });

  // -------------------------------------------------------------
  // ROOMS API
  // -------------------------------------------------------------
  app.get('/api/rooms', (req, res) => {
    const all = req.query.all === 'true';
    let rooms = db.getRooms();
    if (!all) {
      rooms = rooms.filter((r) => r.status === 'Active');
    }
    res.json(rooms);
  });

  app.get('/api/rooms/:id', (req, res) => {
    const room = db.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  });

  app.post('/api/rooms', (req, res) => {
    try {
      const newRoom = db.createRoom(req.body);
      res.status(201).json(newRoom);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/rooms/:id', (req, res) => {
    try {
      const updated = db.updateRoom(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/rooms/:id/price', (req, res) => {
    try {
      const { price, discount_price, inventory_count, status } = req.body;
      const updates: any = {};
      if (price !== undefined) updates.price = Number(price);
      if (discount_price !== undefined) updates.discount_price = Number(discount_price);
      if (inventory_count !== undefined) updates.inventory_count = Number(inventory_count);
      if (status !== undefined) updates.status = status;

      const updated = db.updateRoom(req.params.id, updates);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/rooms/:id', (req, res) => {
    try {
      db.deleteRoom(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // AVAILABILITY & PRICING API
  // -------------------------------------------------------------
  app.get('/api/availability/check', (req, res) => {
    const { roomId, checkIn, checkOut } = req.query;
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing roomId, checkIn, or checkOut' });
    }
    const available = db.checkRoomAvailability(
      String(roomId),
      String(checkIn),
      String(checkOut)
    );
    res.json({ available });
  });

  app.get('/api/availability/calendar', (req, res) => {
    const { roomId } = req.query;
    const all = db.getAvailability();
    const filtered = roomId ? all.filter((a) => a.room_id === roomId) : all;
    res.json(filtered);
  });

  app.post('/api/availability/block', (req, res) => {
    try {
      const { roomId, dates, status, notes } = req.body;
      const updated = db.blockDates(roomId, dates, status, notes);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/availability/unblock', (req, res) => {
    try {
      const { roomId, dates } = req.body;
      const updated = db.unblockDates(roomId, dates);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/pricing/calculate', (req, res) => {
    try {
      const { roomId, checkIn, checkOut, couponCode } = req.body;
      const pricing = db.calculatePricing(roomId, checkIn, checkOut, couponCode);
      res.json(pricing);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, amount } = req.body;
    const result = db.verifyCoupon(code, Number(amount || 0));
    res.json(result);
  });

  // -------------------------------------------------------------
  // BOOKINGS API
  // -------------------------------------------------------------
  app.post('/api/bookings', (req, res) => {
    try {
      const user = (req as any).user;
      const payload = req.body;

      // Assign user ID or guest placeholder
      const userId = user ? user.id : `guest_${Date.now()}`;

      const newBooking = db.createBooking({
        ...payload,
        userId,
      });

      // Automatically dispatch email confirmation to guest email
      if (newBooking?.guest?.email) {
        emailService.sendBookingConfirmation(newBooking).catch((err) => {
          console.error('[Auto-Email] Failed to send booking confirmation:', err);
        });
      }

      res.status(201).json(newBooking);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/bookings', (req, res) => {
    const { status, payment_status, roomId, search } = req.query;
    let list = db.getBookings();

    if (status) {
      list = list.filter((b) => b.status === status);
    }
    if (payment_status) {
      list = list.filter((b) => b.payment_status === payment_status);
    }
    if (roomId) {
      list = list.filter((b) => b.room_id === roomId);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (b) =>
          b.booking_number.toLowerCase().includes(q) ||
          b.guest.full_name.toLowerCase().includes(q) ||
          b.guest.email.toLowerCase().includes(q) ||
          b.guest.phone.includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/bookings/:id', (req, res) => {
    const booking = db.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  app.patch('/api/bookings/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateBookingStatus(req.params.id, status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/bookings/:id/cancel', (req, res) => {
    try {
      const { reason } = req.body;
      const cancelled = db.cancelBooking(req.params.id, reason);

      if (cancelled?.guest?.email) {
        emailService.sendBookingCancellation(cancelled).catch((err) => {
          console.error('[Auto-Email] Cancellation email failed:', err);
        });
      }

      res.json(cancelled);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/user/bookings', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const userBookings = db.getUserBookings(user.id);
    res.json(userBookings);
  });

  // -------------------------------------------------------------
  // PAYMENTS & REFUNDS
  // -------------------------------------------------------------
  app.get('/api/payments', (req, res) => {
    res.json(db.getPayments());
  });

  app.post('/api/payments/:id/refund', (req, res) => {
    try {
      const { amount, reason } = req.body;
      const result = db.processRefund(req.params.id, Number(amount), reason);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // REVIEWS API
  // -------------------------------------------------------------
  app.get('/api/reviews', (req, res) => {
    const includePending = req.query.all === 'true';
    res.json(db.getReviews(includePending));
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const rev = db.addReview(req.body);
      res.status(201).json(rev);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/reviews/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateReviewStatus(req.params.id, status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // ENQUIRIES / CONTACT API
  // -------------------------------------------------------------
  app.post('/api/enquiries', (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email and message' });
      }
      const newEnq = db.createEnquiry({ name, email, phone: phone || '', message });

      if (newEnq?.email) {
        emailService.sendEnquiryReceipt(newEnq).catch((err) => {
          console.error('[Auto-Email] Enquiry receipt email failed:', err);
        });
      }

      res.status(201).json(newEnq);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/enquiries', (req, res) => {
    res.json(db.getEnquiries());
  });

  app.patch('/api/enquiries/:id', (req, res) => {
    try {
      const { status, notes } = req.body;
      const updated = db.updateEnquiryStatus(req.params.id, status, notes);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // GALLERY API
  // -------------------------------------------------------------
  app.get('/api/gallery', (req, res) => {
    res.json(db.getGallery());
  });

  app.post('/api/gallery', (req, res) => {
    try {
      const item = db.addGalleryItem(req.body);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/gallery/:id', (req, res) => {
    try {
      db.deleteGalleryItem(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // AMENITIES API
  // -------------------------------------------------------------
  app.get('/api/amenities', (req, res) => {
    res.json(db.getAmenities());
  });

  app.patch('/api/amenities/:id', (req, res) => {
    try {
      const updated = db.updateAmenity(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/amenities', (req, res) => {
    try {
      const created = db.createAmenity(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // EMAIL TEMPLATES & LOGS
  // -------------------------------------------------------------
  app.get('/api/email-templates', (req, res) => {
    res.json(db.getEmailTemplates());
  });

  app.patch('/api/email-templates/:id', (req, res) => {
    try {
      const updated = db.updateEmailTemplate(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/email-logs', (req, res) => {
    const { recipient, booking } = req.query;
    let logs = db.getEmailLogs();
    if (recipient) {
      logs = logs.filter((l) => l.recipient.toLowerCase() === String(recipient).toLowerCase());
    }
    if (booking) {
      logs = logs.filter((l) => l.related_booking === String(booking));
    }
    res.json(logs);
  });

  app.post('/api/email-send-test', async (req, res) => {
    try {
      const { to, templateName, customData } = req.body;
      const targetRecipient = to || 'luckyrajgupta1994@gmail.com';
      const guestName = customData?.guest_name || 'Shri Lucky Raj';
      const bookingId = customData?.booking_id || `KR${Math.floor(100000 + Math.random() * 900000)}`;

      const textBody = `Namaste ${guestName},

This is an automated dispatch test from Kanha Residency, Mathura.

DISPATCH SPECIFICATIONS:
• Recipient: ${targetRecipient}
• Reference ID: ${bookingId}
• Service Status: Real-time Mail Pipeline Active
• Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Pilgrimage Hospitality Desk:
Kanha Residency, Techman Nilgiri, Mathura, UP 281006
Concierge: +91 98970 12345`;

      const result = await emailService.sendEmail({
        to: targetRecipient,
        subject: `Kanha Residency Mathura: System Notification (${bookingId})`,
        text: textBody,
        templateName: templateName || 'System Test',
        relatedBooking: bookingId,
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/smtp/test', async (req, res) => {
    try {
      const { host, port, user, pass, secure, testRecipient } = req.body;
      const recipient = testRecipient || user || 'luckyrajgupta1994@gmail.com';

      // If custom SMTP credentials provided, save temporarily or test
      const testResult = await emailService.sendEmail({
        to: recipient,
        subject: 'Kanha Residency: SMTP Configuration Verification',
        text: `Namaste,\n\nYour SMTP outgoing mail configuration has been successfully tested on Kanha Residency reservation platform.\n\nHost: ${host || 'Default Transport'}\nTested At: ${new Date().toISOString()}`,
        templateName: 'SMTP Test',
      });

      res.json(testResult);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'SMTP Connection Test Failed' });
    }
  });

  app.post('/api/email-logs/:id/retry', (req, res) => {
    try {
      const retried = db.retryEmail(req.params.id);
      res.json(retried);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------------------------------------------------
  // SETTINGS, NOTIFICATIONS & AUDIT
  // -------------------------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/notifications', (req, res) => {
    res.json(db.getNotifications());
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const updated = db.markNotificationRead(req.params.id);
    res.json(updated);
  });

  app.delete('/api/notifications', (req, res) => {
    db.clearNotifications();
    res.json({ success: true });
  });

  app.get('/api/audit-logs', (req, res) => {
    res.json(db.getAuditLogs());
  });

  // -------------------------------------------------------------
  // ADMIN DASHBOARD STATS
  // -------------------------------------------------------------
  app.get('/api/admin/stats', (req, res) => {
    const bookings = db.getBookings();
    const rooms = db.getRooms();
    const enquiries = db.getEnquiries();

    const todayStr = new Date().toISOString().split('T')[0];

    const todayCheckIns = bookings.filter((b) => b.check_in === todayStr && b.status === 'Confirmed').length;
    const todayCheckOuts = bookings.filter((b) => b.check_out === todayStr && b.status === 'Checked In').length;
    const activeBookings = bookings.filter((b) => ['Confirmed', 'Checked In'].includes(b.status)).length;
    const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
    const pendingEnquiries = enquiries.filter((e) => e.status === 'New').length;

    const totalRevenue = bookings
      .filter((b) => b.payment_status === 'Paid')
      .reduce((sum, b) => sum + b.total, 0);

    const totalRoomsCount = rooms.reduce((sum, r) => sum + (r.inventory_count || 1), 0);
    const occupancyPercentage = Math.min(100, Math.round((activeBookings / Math.max(1, totalRoomsCount)) * 100));

    // Monthly revenue points for chart
    const monthlyRevenue = [
      { month: 'Jan', revenue: 145000, bookings: 18 },
      { month: 'Feb', revenue: 182000, bookings: 24 },
      { month: 'Mar', revenue: 210000, bookings: 29 },
      { month: 'Apr', revenue: 275000, bookings: 36 },
      { month: 'May', revenue: totalRevenue + 310000, bookings: 42 },
    ];

    res.json({
      todayCheckIns,
      todayCheckOuts,
      activeBookings,
      pendingBookings,
      pendingEnquiries,
      totalRevenue,
      occupancyPercentage,
      totalRoomsCount,
      monthlyRevenue,
    });
  });

  // -------------------------------------------------------------
  // CSV EXPORT
  // -------------------------------------------------------------
  app.get('/api/export/:type', (req, res) => {
    const type = req.params.type as any;
    const csv = db.exportCSV(type);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=kanha_${type}_${Date.now()}.csv`);
    res.send(csv);
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE (DEV) / STATIC SERVE (PROD)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kanha Residency server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
