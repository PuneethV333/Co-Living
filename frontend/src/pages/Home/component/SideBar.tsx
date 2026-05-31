import { useEffect, useRef } from "react";
import {
  Home,
  Search,
  Users,
  BookOpen,
  Heart,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";

// ── Types ────────────────────────────────────────────────────────────────────
type City = "Bengaluru" | "Mumbai" | "Delhi" | "Pune" | "Hyderabad";
type RoomType = "Shared" | "Private";
type PropertyType = "Apartment" | "House" | "Condo";
type Amenity = "WiFi" | "AC" | "Gym" | "Parking" | "Laundry" | "CCTV";
type Gender = "Any" | "Male" | "Female";

// ── Static filter data ───────────────────────────────────────────────────────
const CITIES: City[] = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad"];
const ROOM_TYPES: RoomType[] = ["Shared", "Private"];
const PROPERTY_TYPES: PropertyType[] = ["Apartment", "House", "Condo"];
const AMENITIES: Amenity[] = ["WiFi", "AC", "Gym", "Parking", "Laundry", "CCTV"];
const GENDERS: Gender[] = ["Any", "Male", "Female"];

const NAV_ITEMS = [
  { icon: Home, label: "Home", to: "/home", badge: null },
  { icon: Search, label: "Browse", to: "/home/browse", badge: 124 },
  { icon: Users, label: "Roommates", to: "/home/roommates", badge: null },
  { icon: BookOpen, label: "My Bookings", to: "/home/bookings", badge: null },
  { icon: Heart, label: "Saved", to: "/home/saved", badge: null },
];

// ── Chip component ───────────────────────────────────────────────────────────
const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-[12px] font-medium border transition-all duration-200 ${
      active
        ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30"
        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
    }`}
  >
    {label}
  </button>
);

// ── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 mb-2.5">
    {label}
  </p>
);

// ── Main SideBar ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { useUiContext } from "../../../hooks/useUiContext";
import useIsMobile from "../../../hooks/useIsMobile";

const SideBar = () => {
  const { menuIsOpen, setMenuIsOpen } = useUiContext();
  const isMobile = useIsMobile();
  const backdropRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [city, setCity] = useState<City>("Bengaluru");
  const [roomType, setRoomType] = useState<RoomType>("Shared");
  const [propTypes, setPropTypes] = useState<PropertyType[]>([]);
  const [budget, setBudget] = useState(20000);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [gender, setGender] = useState<Gender>("Any");

  const toggleArr = <T,>(arr: T[], setArr: (v: T[]) => void, val: T) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  // Animate backdrop
  useEffect(() => {
    if (!backdropRef.current || !isMobile) return;
    if (menuIsOpen) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, display: "block" });
    } else {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          if (backdropRef.current) backdropRef.current.style.display = "none";
        },
      });
    }
  }, [menuIsOpen, isMobile]);

  const formatBudget = (v: number) => `₹${(v / 1000).toFixed(0)}K/mo`;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          ref={backdropRef}
          onClick={() => setMenuIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 hidden"
        />
      )}

      {/* Sidebar panel */}
      <div className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-5 flex flex-col gap-6">

        {/* Mobile close row */}
        {isMobile && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-orange-400" />
              <span className="text-[14px] font-semibold text-white">Filters</span>
            </div>
            <button
            title="clc"
              onClick={() => setMenuIsOpen(false)}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <div>
          <SectionLabel label="Navigation" />
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ icon: Icon, label, to, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/home"}
                onClick={() => isMobile && setMenuIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500/15 text-orange-300 border border-orange-500/20"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? "text-orange-400" : ""} />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-bold text-orange-300">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* City */}
        <div>
          <SectionLabel label="City" />
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Chip key={c} label={c} active={city === c} onClick={() => setCity(c)} />
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div>
          <SectionLabel label="Room Type" />
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map((r) => (
              <Chip key={r} label={r} active={roomType === r} onClick={() => setRoomType(r)} />
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <SectionLabel label="Property Type" />
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((p) => (
              <Chip
                key={p}
                label={p}
                active={propTypes.includes(p)}
                onClick={() => toggleArr(propTypes, setPropTypes, p)}
              />
            ))}
          </div>
        </div>

        {/* Budget slider */}
        <div>
          <SectionLabel label="Max Budget" />
          <p className="text-[15px] font-bold text-white mb-3">
            {formatBudget(budget)}
          </p>
          <input
            title="budget"
            type="range"
            min={3000}
            max={80000}
            step={1000}
            value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            className="w-full accent-orange-500 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-zinc-600">₹3K</span>
            <span className="text-[11px] text-zinc-600">₹80K</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <SectionLabel label="Amenities" />
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <Chip
                key={a}
                label={a}
                active={amenities.includes(a)}
                onClick={() => toggleArr(amenities, setAmenities, a)}
              />
            ))}
          </div>
        </div>

        {/* Gender preference */}
        <div>
          <SectionLabel label="Preferred For" />
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} label={g} active={gender === g} onClick={() => setGender(g)} />
            ))}
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={() => isMobile && setMenuIsOpen(false)}
          className="mt-auto w-full rounded-xl bg-orange-500 py-3 text-[13px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
};

export default SideBar;