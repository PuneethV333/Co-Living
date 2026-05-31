import { Bath, Bed, Building2, CheckCircle2, ChevronDown, Flame, Heart, HomeIcon, LayoutGrid, List, MapPin, Maximize2, Star, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

type PropertyType = "Apartment" | "House" | "Condo" | "PG" | "Villa";
type RoomType = "Shared" | "Private";
type BedType = "Single Bed" | "Double Bed" | "Bunk Bed" | "Queen Bed";

interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  type: PropertyType;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  hot: boolean;
  emoji: string;
  isFav: boolean;
}

interface Room {
  id: string;
  name: string;
  property: string;
  type: RoomType;
  bedType: BedType;
  sqft: number;
  occupants: number;
  maxOccupants: number;
  deposit: number;
  price: number;
  verified: boolean;
  availableNow: boolean;
  full: boolean;
  emoji: string;
  last: boolean;
}


const PROPERTIES: Property[] = [
  {
    id: "1", name: "Skyline Apartments, Koramangala", location: "5th Block, Koramangala, Bengaluru",
    city: "Bengaluru", type: "Apartment", beds: 3, baths: 2, sqft: 1200, price: 18000,
    rating: 4.8, reviewCount: 24, verified: true, hot: true, emoji: "🏢", isFav: false,
  },
  {
    id: "2", name: "Green Valley Residency", location: "HSR Layout, Sector 2, Bengaluru",
    city: "Bengaluru", type: "Apartment", beds: 2, baths: 1, sqft: 900, price: 14500,
    rating: 4.5, reviewCount: 18, verified: true, hot: false, emoji: "🏠", isFav: true,
  },
  {
    id: "3", name: "Urban Nest, Indiranagar", location: "12th Main, Indiranagar, Bengaluru",
    city: "Bengaluru", type: "Condo", beds: 2, baths: 2, sqft: 1050, price: 22000,
    rating: 4.7, reviewCount: 31, verified: false, hot: false, emoji: "🏘️", isFav: false,
  },
  {
    id: "4", name: "Maple Heights, Whitefield", location: "ITPL Main Rd, Whitefield, Bengaluru",
    city: "Bengaluru", type: "Villa", beds: 4, baths: 3, sqft: 1800, price: 32000,
    rating: 4.9, reviewCount: 12, verified: true, hot: false, emoji: "🏡", isFav: false,
  },
];

const ROOMS: Room[] = [
  {
    id: "r1", name: "Shared Room – Skyline Apts, Koramangala", property: "Skyline Apartments",
    type: "Shared", bedType: "Double Bed", sqft: 220, occupants: 2, maxOccupants: 3,
    deposit: 17000, price: 8500, verified: true, availableNow: false, full: false, emoji: "🛏️", last: false,
  },
  {
    id: "r2", name: "Private Room – Green Valley, HSR Layout", property: "Green Valley Residency",
    type: "Private", bedType: "Single Bed", sqft: 180, occupants: 0, maxOccupants: 1,
    deposit: 24000, price: 12000, verified: true, availableNow: true, full: false, emoji: "🏠", last: true,
  },
  {
    id: "r3", name: "Shared Room – Urban Nest, Indiranagar", property: "Urban Nest",
    type: "Shared", bedType: "Bunk Bed", sqft: 260, occupants: 1, maxOccupants: 4,
    deposit: 19600, price: 9800, verified: true, availableNow: false, full: false, emoji: "🛌", last: false,
  },
  {
    id: "r4", name: "Shared Room – Maple Heights, Whitefield", property: "Maple Heights",
    type: "Shared", bedType: "Queen Bed", sqft: 360, occupants: 3, maxOccupants: 3,
    deposit: 0, price: 7500, verified: false, availableNow: false, full: true, emoji: "🚫", last: false,
  },
];


const Badge = ({ label, variant }: { label: string; variant: "verified" | "hot" | "type" | "shared" | "private" | "last" | "full" }) => {
  const styles: Record<string, string> = {
    verified: "bg-green-500/15 text-green-400 border-green-500/20",
    hot: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    type: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    shared: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    private: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    last: "bg-red-500/15 text-red-400 border-red-500/20",
    full: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles[variant]}`}>
      {variant === "verified" && <CheckCircle2 size={9} />}
      {variant === "hot" && <Flame size={9} />}
      {label}
    </span>
  );
};

const PropertyCard = ({ p, view }: { p: Property; view: "grid" | "list" }) => {
  const [fav, setFav] = useState(p.isFav);

  if (view === "list") {
    return (
      <div className="flex gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 hover:border-white/10 transition group">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-zinc-800/60 flex items-center justify-center text-3xl shrink-0">
          {p.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                {p.verified && <Badge label="✓ Verified" variant="verified" />}
                {p.hot && <Badge label="Hot" variant="hot" />}
                <Badge label={p.type} variant="type" />
              </div>
              <p className="text-[14px] font-semibold text-white truncate">{p.name}</p>
              <p className="flex items-center gap-1 text-[12px] text-zinc-500 mt-0.5">
                <MapPin size={11} /> {p.location}
              </p>
            </div>
            <button title="an" onClick={() => setFav(f => !f)} className="shrink-0 text-zinc-600 hover:text-red-400 transition">
              <Heart size={16} fill={fav ? "#f87171" : "none"} className={fav ? "text-red-400" : ""} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[12px] text-zinc-500">
            <span className="flex items-center gap-1"><Bed size={12} /> {p.beds} Beds</span>
            <span className="flex items-center gap-1"><Bath size={12} /> {p.baths} Baths</span>
            <span className="flex items-center gap-1"><Maximize2 size={12} /> {p.sqft} sqft</span>
            <span className="flex items-center gap-1 ml-auto text-yellow-400">
              <Star size={11} fill="currentColor" /> {p.rating}
              <span className="text-zinc-600">({p.reviewCount})</span>
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[16px] font-bold text-white">₹{p.price.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-zinc-600">/mo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group cursor-pointer">
      {/* Image placeholder */}
      <div className="relative h-36 bg-zinc-800/60 flex items-center justify-center">
        <span className="text-5xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">
          {p.emoji}
        </span>
        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.verified && <Badge label="✓ Verified" variant="verified" />}
          {p.hot && <Badge label="Hot" variant="hot" />}
          {!p.verified && !p.hot && <Badge label={p.type} variant="type" />}
        </div>
        {/* Fav top-right */}
        <button
        title="maa"
          onClick={() => setFav(f => !f)}
          className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition"
        >
          <Heart size={14} fill={fav ? "#f87171" : "none"} className={fav ? "text-red-400" : "text-zinc-400"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[13px] font-semibold text-white leading-snug mb-1">{p.name}</p>
        <p className="flex items-center gap-1 text-[11px] text-zinc-500 mb-3">
          <MapPin size={10} /> {p.location}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mb-3">
          <span className="flex items-center gap-1"><Bed size={11} /> {p.beds}</span>
          <span className="flex items-center gap-1"><Bath size={11} /> {p.baths}</span>
          <span className="flex items-center gap-1"><Maximize2 size={11} /> {p.sqft}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[16px] font-bold text-white">₹{p.price.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-zinc-600">/mo</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-yellow-400">
            <Star size={11} fill="currentColor" /> {p.rating}
            <span className="text-zinc-600">({p.reviewCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const RoomRow = ({ r }: { r: Room }) => {
  const pct = Math.round((r.occupants / r.maxOccupants) * 100);

  return (
    <div className={`flex gap-3 md:gap-4 rounded-2xl border border-white/5 bg-white/3 p-3 md:p-4 transition
      ${r.full ? "opacity-45" : "hover:border-white/10"}`}>
      {/* Icon */}
      <div className="h-14 w-14 rounded-xl bg-zinc-800/70 flex items-center justify-center text-2xl shrink-0">
        {r.emoji}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {r.verified && <Badge label="✓ Verified" variant="verified" />}
          <Badge label={r.type} variant={r.type === "Shared" ? "shared" : "private"} />
          {r.last && <Badge label="Last 1" variant="last" />}
          {r.full && <Badge label="Full" variant="full" />}
        </div>
        <p className="text-[13px] font-semibold text-white truncate">{r.name}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500 flex-wrap">
          <span className="flex items-center gap-1"><Bed size={10} /> {r.bedType}</span>
          <span className="flex items-center gap-1"><Maximize2 size={10} /> {r.sqft} sqft</span>
          <span className="flex items-center gap-1"><Users size={10} /> {r.occupants}/{r.maxOccupants} occupants</span>
          {r.deposit > 0 && (
            <span className="text-zinc-600">₹{r.deposit.toLocaleString("en-IN")} deposit</span>
          )}
        </div>

        {/* Occupancy bar */}
        <div className="mt-2.5">
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 66 ? "bg-orange-500" : "bg-green-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">
            {r.full ? "Fully occupied" : `${r.occupants} of ${r.maxOccupants} spots filled`}
          </p>
        </div>
      </div>

      {/* Price + action */}
      <div className="flex flex-col items-end justify-between shrink-0 gap-2">
        <div className="text-right">
          <p className="text-[15px] font-bold text-white">₹{r.price.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-zinc-600">/mo</p>
        </div>
        {r.availableNow && (
          <p className="text-[10px] font-semibold text-green-400">● Available Now</p>
        )}
        {!r.availableNow && !r.full && (
          <p className="text-[10px] text-zinc-500">● Available</p>
        )}
        <button
          disabled={r.full}
          className={`rounded-xl px-3 py-1.5 text-[12px] font-semibold transition active:scale-95
            ${r.full
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
              : "bg-orange-500 text-white hover:bg-orange-400 shadow-md shadow-orange-500/20"
            }`}
        >
          {r.full ? "Waitlist" : "Request"}
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  "Recommended", "Price Low → High", "Price High → Low", "Newest", "Top Rated",
];

const Dashboard = () => {
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<"Shared · Private" | "Shared" | "Private">("Shared · Private");

  return (
    <div className="flex flex-col gap-10 pb-10">

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {[
          { icon: <Building2 size={16} />, label: "Properties", value: "124", color: "text-orange-400" },
          { icon: <HomeIcon size={16} />, label: "Rooms", value: "76", color: "text-purple-400" },
          { icon: <TrendingUp size={16} />, label: "Avg Price", value: "₹11K", color: "text-green-400" },
          { icon: <Users size={16} />, label: "Roommates", value: "340+", color: "text-cyan-400" },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-white/5 bg-white/3 px-4 py-3 flex items-center gap-3">
            <div className={`${color} opacity-80`}>{icon}</div>
            <div>
              <p className="text-[16px] font-bold text-white">{value}</p>
              <p className="text-[11px] text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Location + filter chips ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button className="flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-orange-300">
          <MapPin size={12} /> Bengaluru
        </button>
        <button className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-400 hover:text-white transition">
          124 results
        </button>
        {(["Shared · Private", "Shared", "Private"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${
              activeFilter === f
                ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ══════════ PROPERTIES SECTION ══════════ */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">Available Properties</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">Full apartments &amp; shared houses</p>
          </div>
          <button className="text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition flex items-center gap-1">
            View all →
          </button>
        </div>

        {/* Sort + view toggle */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <select
              title="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white/5 border border-white/8 pl-4 pr-9 py-2.5 text-[13px] text-zinc-300 outline-none focus:border-orange-500/50 transition cursor-pointer scheme-dark"
            >
              {SORT_OPTIONS.map((o) => <option key={o} value={o}>Sort: {o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/5 p-1 ml-auto">
            <button
              onClick={() => setView("grid")}
              className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${view === "grid" ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-white"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${view === "list" ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-white"}`}
            >
              <List size={14} />
            </button>
          </div>

          <p className="text-[12px] text-zinc-600 hidden sm:block">48 properties</p>
        </div>

        {/* Grid / List */}
        <div className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "flex flex-col gap-3"
        }>
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.id} p={p} view={view} />
          ))}
        </div>
      </section>

      {/* ══════════ ROOMS SECTION ══════════ */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">Available Rooms</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">Shared &amp; private rooms ready to move in</p>
          </div>
          <button className="text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition flex items-center gap-1">
            View all →
          </button>
        </div>

        {/* Sort */}
        <div className="relative max-w-xs mb-4">
          <select
            title="sort rooms"
            className="w-full appearance-none rounded-xl bg-white/5 border border-white/8 pl-4 pr-9 py-2.5 text-[13px] text-zinc-300 outline-none focus:border-orange-500/50 transition cursor-pointer scheme-dark"
            defaultValue="Price Low → High"
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>

        <p className="text-[12px] text-zinc-600 mb-3">76 rooms</p>

        <div className="flex flex-col gap-3">
          {ROOMS.map((r) => <RoomRow key={r.id} r={r} />)}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;