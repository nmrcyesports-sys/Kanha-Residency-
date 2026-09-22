import { Users, Bed, Maximize2, ArrowRight, Check } from 'lucide-react';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onViewDetails: (room: Room) => void;
  onBookNow: (room: Room) => void;
}

export function RoomCard({ room, onViewDetails, onBookNow }: RoomCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(room.price);

  const formattedDiscountPrice = room.discount_price
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(room.discount_price)
    : null;

  return (
    <div className="group relative rounded-2xl bg-[#141518] border border-[#2D2822] overflow-hidden luxury-card-hover flex flex-col justify-between">
      {/* Image Container with Hover Zoom */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#1A1B20] luxury-img-zoom">
        <img
          src={room.featured_image}
          alt={room.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/20" />

        {/* Featured Tag */}
        {room.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#121316]/80 backdrop-blur-md border border-[#C5A880]/50 text-[#E5C79E] text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg">
            Signature Stay
          </div>
        )}

        {/* Price Pill */}
        <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-[#121316]/90 backdrop-blur-md border border-[#3A342B] text-right transition-transform group-hover:scale-105">
          <div className="text-[10px] text-[#A3998C] uppercase tracking-wider">From</div>
          <div className="flex items-baseline space-x-1.5">
            {formattedDiscountPrice ? (
              <>
                <span className="text-base font-serif font-bold text-[#E5C79E]">
                  {formattedDiscountPrice}
                </span>
                <span className="text-xs text-[#7A7369] line-through">
                  {formattedPrice}
                </span>
              </>
            ) : (
              <span className="text-base font-serif font-bold text-[#FAF7F2]">
                {formattedPrice}
              </span>
            )}
            <span className="text-[11px] text-[#A3998C]">/ night</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Room Title */}
          <h3 className="font-serif text-2xl font-normal text-[#FAF7F2] group-hover:text-[#E5C79E] transition-colors mb-2">
            {room.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#B5ABA0] line-clamp-2 leading-relaxed mb-5">
            {room.short_description}
          </p>

          {/* Specs / Meta Badges */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#252320] mb-5 text-[#C8BFB2]">
            <div className="flex items-center space-x-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{room.max_guests} Guests</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <Bed className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="truncate">{room.bed_type}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{room.room_size}</span>
            </div>
          </div>

          {/* Amenities Mini List */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#1B1D23] text-[10px] text-[#C4B8A9] font-medium luxury-pill-hover cursor-default"
              >
                <Check className="w-2.5 h-2.5 text-[#C5A880]" />
                <span>{amenity}</span>
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-[#1B1D23] text-[10px] text-[#8C8377] luxury-pill-hover cursor-default">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onViewDetails(room)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#3A342B] text-xs uppercase tracking-[0.15em] font-semibold text-[#E8E2D9] hover:bg-[#FAF7F2]/5 hover:border-[#C5A880]/60 transition-all text-center cursor-pointer luxury-btn-hover"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(room)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] text-xs uppercase tracking-[0.15em] font-bold shadow-md hover:shadow-lg hover:shadow-[#C5A880]/20 transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer luxury-btn-hover group/btn"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
