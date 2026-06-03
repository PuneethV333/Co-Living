import { Bed, Maximize2, Users, CheckCircle2 } from "lucide-react";
import type { RoomType } from "../types/property.types";

const Badge = ({
  label,
  variant,
}: {
  label: string;
  variant: "verified" | "shared" | "private" | "last" | "full";
}) => {
  const styles = {
    verified: "bg-green-500/15 text-green-400 border-green-500/20",
    shared:   "bg-purple-500/15 text-purple-400 border-purple-500/20",
    private:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    last:     "bg-red-500/15 text-red-400 border-red-500/20",
    full:     "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles[variant]}`}>
      {variant === "verified" && <CheckCircle2 size={9} />}
      {label}
    </span>
  );
};

export const RoomRow = ({ r, propertyName }: { r: RoomType; propertyName?: string }) => {
  const { roomDetails, pricing, availability } = r;
  const isFull = availability.currentOccupants >= roomDetails.capacity;
  const isLast = !isFull && roomDetails.capacity - availability.currentOccupants === 1;
  const isAvailableNow = availability.currentOccupants === 0;
  const pct = Math.round((availability.currentOccupants / roomDetails.capacity) * 100);

  const BED_LABELS: Record<string, string> = {
    single: "Single Bed", double: "Double Bed", bunk: "Bunk Bed",
  };

  return (
    <div className={`flex gap-3 md:gap-4 rounded-2xl border border-white/5 bg-white/3 p-3 md:p-4 transition
      ${isFull ? "opacity-50 saturate-50" : "hover:border-white/10 hover:bg-white/5"}`}
    >
      
      <div className="h-14 w-14 rounded-xl bg-zinc-800/70 flex items-center justify-center overflow-hidden shrink-0">
        {r.photos[0]
          ? <img src={r.photos[0]} alt="room" className="h-full w-full object-cover" />
          : <span className="text-3xl">
              {roomDetails.roomType === "private" ? "🏠" : "🛏️"}
            </span>
        }
      </div>

      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <Badge label="✓ Verified" variant="verified" />
          <Badge label={roomDetails.roomType === "shared" ? "Shared" : "Private"} variant={roomDetails.roomType} />
          {isLast && <Badge label="Last 1" variant="last" />}
          {isFull && <Badge label="Full" variant="full" />}
        </div>
        <p className="text-[13px] font-semibold text-white truncate">
          {roomDetails.roomType === "shared" ? "Shared" : "Private"} Room
          {propertyName ? ` – ${propertyName}` : ""}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500 flex-wrap">
          <span className="flex items-center gap-1"><Bed size={10} /> {BED_LABELS[roomDetails.bedType]}</span>
          <span className="flex items-center gap-1"><Maximize2 size={10} /> {roomDetails.area} sqft</span>
          <span className="flex items-center gap-1">
            <Users size={10} /> {availability.currentOccupants}/{roomDetails.capacity} occupants
          </span>
          {pricing.securityDeposit > 0 && (
            <span className="text-zinc-600">₹{pricing.securityDeposit.toLocaleString("en-IN")} deposit</span>
          )}
        </div>

        
        <div className="mt-2.5">
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct >= 100 ? "bg-red-500" : pct >= 66 ? "bg-orange-500" : "bg-green-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">
            {isFull
              ? "Fully occupied"
              : `${availability.currentOccupants} of ${roomDetails.capacity} spots filled`}
          </p>
        </div>
      </div>

      
      <div className="flex flex-col items-end justify-between shrink-0 gap-2">
        <div className="text-right">
          <p className="text-[15px] font-bold text-white">
            ₹{pricing.monthlyRent.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-zinc-600">/mo</p>
        </div>
        {isAvailableNow && !isFull && (
          <p className="text-[10px] font-semibold text-green-400">● Available Now</p>
        )}
        {!isAvailableNow && !isFull && (
          <p className="text-[10px] text-zinc-500">● Available</p>
        )}
        <button
          disabled={isFull}
          className={`rounded-xl px-3 py-1.5 text-[12px] font-semibold transition active:scale-95
            ${isFull
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
              : "bg-orange-500 text-white hover:bg-orange-400 shadow-md shadow-orange-500/20"
            }`}
        >
          {isFull ? "WaitList" : "Request"}
        </button>
      </div>
    </div>
  );
};