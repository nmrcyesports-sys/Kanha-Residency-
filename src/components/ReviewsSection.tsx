import { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, X, CheckCircle2 } from 'lucide-react';
import type { Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ScrollReveal } from './ScrollExperience';

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [roomName, setRoomName] = useState('Deluxe Room');
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    api.getReviews().then(setReviews).catch(console.warn);
  }, []);

  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestLocation(user.address || 'India');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !reviewText) return;

    setIsSubmitting(true);
    try {
      const newRev = await api.submitReview({
        user_name: guestName,
        user_location: guestLocation || 'Verified Guest',
        room_name: roomName,
        room_id: 'room_deluxe',
        rating,
        title: title || 'Exceptional Stay in Mathura',
        review: reviewText,
        verified_guest: true,
      });
      setReviews((prev) => [newRev, ...prev]);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
        setReviewText('');
        setTitle('');
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#0A0B0D] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#25221D]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-2 block">
                Guest Testimonials
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#FAF7F2]">
                Words of Serenity
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border border-[#C5A880] text-[#C5A880] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#C5A880] hover:text-[#121316] transition-all cursor-pointer luxury-btn-hover"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Share Your Experience</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <ScrollReveal key={rev.id} delay={idx * 0.1} direction="up">
              <div
                className="rounded-2xl bg-[#141518] border border-[#2D2822] p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5A880]/50 transition-all duration-300 shadow-lg luxury-card-hover h-full"
              >
                <div>
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.verified_guest && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-[#A3998C] bg-[#1E2026] px-2 py-0.5 rounded-full border border-[#332E27]">
                        <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
                        <span>Verified Stay</span>
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h4 className="font-serif text-xl font-medium text-[#FAF7F2] mb-3">
                      "{rev.title}"
                    </h4>
                  )}

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#C4B8A9] font-light leading-relaxed mb-6">
                    {rev.review}
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#25221D] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#FAF7F2]">{rev.user_name}</div>
                    <div className="text-[10px] text-[#8C8377]">{rev.user_location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#C5A880] font-medium">{rev.room_name}</div>
                    <div className="text-[9px] text-[#6E675D]">
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#141518] border border-[#332E27] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#A3998C] hover:text-[#FAF7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-[#C5A880] mb-3" />
                <h3 className="font-serif text-2xl text-[#FAF7F2] mb-1">Thank You!</h3>
                <p className="text-xs text-[#A3998C]">
                  Your review has been submitted and verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] block mb-1">
                    Your Feedback
                  </span>
                  <h3 className="font-serif text-2xl text-[#FAF7F2]">
                    Review Your Stay
                  </h3>
                </div>

                {/* Rating Picker */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#C5A880] ml-2 font-medium">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Room */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                    Room Type Stayed
                  </label>
                  <select
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Superior Room">Superior Room</option>
                    <option value="Family Suite">Family Suite</option>
                    <option value="Premium Suite">Premium Suite</option>
                  </select>
                </div>

                {/* Guest Name & Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={guestLocation}
                      onChange={(e) => setGuestLocation(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Peaceful haven after Vrindavan darshan"
                    className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share what you enjoyed most about the ambience, comfort, dining, or temple assistance..."
                    className="w-full bg-[#1A1C22] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
