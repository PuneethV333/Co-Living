import { useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
  Heart,
} from "lucide-react";
import type { PropertyType } from "../types/property.types";
import { getPropertyEmoji } from "../types/property.types";
import { useNavigate } from "react-router-dom";
import { Badge } from "./Badge";


export const PropertyCard = ({
  p,
  view,
}: {
  p: PropertyType;
  view: "grid" | "list";
}) => {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const emoji = getPropertyEmoji(p.propertyType);
  const isHot = p.rating >= 4.8 && p.totalReviews >= 20;

  if (view === "list") {
    return (
      <div
        onClick={() => navigate(`/home/property/details/${p._id}`)}
        className="flex gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 hover:border-white/10 transition group"
      >
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-zinc-800/60 flex items-center justify-center overflow-hidden shrink-0">
          {p.photos[0] ? (
            <img
              src={p.photos[0]}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-4xl">{emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                {p.verified && <Badge label="✓ Verified" variant="verified" />}
                {isHot && <Badge label="Hot" variant="hot" />}
                <Badge label={p.propertyType} variant="type" />
              </div>
              <p className="text-[14px] font-semibold text-white truncate">
                {p.name}
              </p>
              <p className="flex items-center gap-1 text-[12px] text-zinc-500 mt-0.5">
                <MapPin size={11} /> {p.location.address}, {p.location.city}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFav((f) => !f);
              }}
              className="shrink-0 text-zinc-600 hover:text-red-400 transition"
            >
              <Heart
                size={16}
                fill={fav ? "#f87171" : "none"}
                className={fav ? "text-red-400" : ""}
              />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[12px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Bed size={12} /> {p.totalBedRooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <Bath size={12} /> {p.totalBathrooms} Baths
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 size={12} /> {p.builtUpArea} sqft
            </span>
            <span className="flex items-center gap-1 ml-auto text-yellow-400">
              <Star size={11} fill="currentColor" /> {p.rating}
              <span className="text-zinc-600">({p.totalReviews})</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/home/property/details/${p._id}`)}
      className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative h-36 bg-zinc-800/60 flex items-center justify-center overflow-hidden">
        {p.photos[0] ? (
          <img
            src={p.photos[0]}
            alt={p.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            {emoji}
          </span>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.verified && <Badge label="✓ Verified" variant="verified" />}
          {isHot && <Badge label="Hot" variant="hot" />}
          {!p.verified && !isHot && (
            <Badge label={p.propertyType} variant="type" />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFav((f) => !f);
          }}
          className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition"
        >
          <Heart
            size={14}
            fill={fav ? "#f87171" : "none"}
            className={fav ? "text-red-400" : "text-zinc-400"}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[13px] font-semibold text-white leading-snug mb-1">
          {p.name}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-zinc-500 mb-3">
          <MapPin size={10} /> {p.location.address}, {p.location.city}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mb-3">
          <span className="flex items-center gap-1">
            <Bed size={11} /> {p.totalBedRooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={11} /> {p.totalBathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={11} /> {p.builtUpArea}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[16px] font-bold text-white">
              ₹{(p.rating * 3000).toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-zinc-600">/mo</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-yellow-400">
            <Star size={11} fill="currentColor" /> {p.rating}
            <span className="text-zinc-600">({p.totalReviews})</span>
          </span>
        </div>
      </div>
    </div>
  );
};
