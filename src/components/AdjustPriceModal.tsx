import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, DollarSign, Layers, Tag, ShieldCheck, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import type { Room } from '../types';
import { api } from '../services/api';

interface AdjustPriceModalProps {
  room: Room | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AdjustPriceModal({ room, onClose, onSaved }: AdjustPriceModalProps) {
  if (!room) return null;

  const [price, setPrice] = useState<number>(room.price);
  const [discountPrice, setDiscountPrice] = useState<number>(room.discount_price || 0);
  const [inventoryCount, setInventoryCount] = useState<number>(room.inventory_count || 4);
  const [status, setStatus] = useState<Room['status']>(room.status || 'Active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (room) {
      setPrice(room.price);
      setDiscountPrice(room.discount_price || 0);
      setInventoryCount(room.inventory_count || 4);
      setStatus(room.status || 'Active');
      setError(null);
      setSuccess(false);
    }
  }, [room]);

  const handleDelta = (amount: number) => {
    setPrice((prev) => Math.max(500, prev + amount));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price <= 0) {
      setError('Please provide a valid nightly price.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.updateRoomPrice(room.id, {
        price: Number(price),
        discount_price: discountPrice > 0 ? Number(discountPrice) : undefined,
        inventory_count: Number(inventoryCount),
        status,
      });

      setSuccess(true);
      onSaved();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update room pricing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#141518] text-[#FAF7F2] rounded-3xl border border-[#3A342B] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#181920] px-6 py-4 border-b border-[#2A2621] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block">
                  Dynamic Inventory Control
                </span>
                <h3 className="font-serif text-lg text-[#FAF7F2]">Adjust Nightly Rate & Capacity</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#A3998C] hover:text-[#FAF7F2] hover:bg-[#25221D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Room mini card */}
            <div className="p-3.5 rounded-2xl bg-[#1A1C22] border border-[#2D2822] flex items-center space-x-3.5">
              <img
                src={room.featured_image}
                alt={room.name}
                className="w-16 h-14 rounded-xl object-cover border border-[#332E27] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base text-[#FAF7F2] truncate">{room.name}</h4>
                  <span className="text-xs text-[#E5C79E] font-mono font-bold">
                    Current: ₹{room.price}
                  </span>
                </div>
                <p className="text-[11px] text-[#A3998C] truncate">
                  {room.bed_type} · Max {room.max_guests} Guests · {room.room_size}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Price & inventory updated successfully!</span>
              </div>
            )}

            {/* Base Price Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Base Nightly Rate (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#A3998C] font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full bg-[#1A1C22] border border-[#332E27] focus:border-[#C5A880] rounded-xl pl-9 pr-4 py-2.5 text-base font-semibold text-[#FAF7F2] focus:outline-none transition-colors"
                />
              </div>

              {/* Quick preset chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-[#A3998C] self-center">Quick Adjust:</span>
                {[
                  { label: '-₹500', val: -500 },
                  { label: '-₹200', val: -200 },
                  { label: '+₹200', val: 200 },
                  { label: '+₹500', val: 500 },
                  { label: '+₹1,000', val: 1000 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleDelta(chip.val)}
                    className="px-2.5 py-1 rounded-lg bg-[#202229] border border-[#332E27] text-xs font-mono text-[#D8CFBF] hover:border-[#C5A880] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount / Promotional Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3998C] mb-1.5 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Promo / Darshan Rate</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#A3998C] font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={discountPrice || ''}
                    placeholder="Optional (e.g. 3150)"
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-[#1A1C22] border border-[#332E27] focus:border-[#C5A880] rounded-xl pl-8 pr-3 py-2 text-xs text-[#FAF7F2] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3998C] mb-1.5 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Total Available Suites</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={inventoryCount}
                  onChange={(e) => setInventoryCount(Number(e.target.value))}
                  className="w-full bg-[#1A1C22] border border-[#332E27] focus:border-[#C5A880] rounded-xl px-3.5 py-2 text-xs text-[#FAF7F2] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Room Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3998C] mb-1.5">
                Inventory Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Active', 'Maintenance', 'Inactive'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      status === s
                        ? s === 'Active'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : s === 'Maintenance'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-rose-950/80 border-rose-500 text-rose-300'
                        : 'bg-[#181920] border-[#2D2822] text-[#8C8377] hover:border-[#403B33]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#332E27] text-xs font-medium text-[#A3998C] hover:text-[#FAF7F2] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C79E] text-[#121316] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#C5A880]/20 hover:shadow-[#C5A880]/40 disabled:opacity-50 cursor-pointer luxury-btn-hover"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : success ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save New Rate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
