import { useEffect, useRef } from "react";
import {
  Home,
  Search,
  Users,
  BookOpen,
  Heart,
  X,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { useUiContext } from "../../../hooks/useUiContext";
import useIsMobile from "../../../hooks/useIsMobile";
import { useFilters } from "../../../hooks/useFilters";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad"];
const ROOM_TYPES = [
  { label: "All", value: "all" },
  { label: "Shared", value: "shared" },
  { label: "Private", value: "private" },
] as const;
const PROPERTY_TYPES = [
  "apartment",
  "house",
  "villa",
  "pg",
  "studio",
  "hostel",
];
const AMENITIES = [
  "wifi",
  "ac",
  "gym",
  "parking",
  "washingMachine",
  "security",
  "lift",
  "furnished",
];
const GENDERS = ["Any", "Male", "Female"];

const NAV_ITEMS = [
  { icon: Home, label: "Home", to: "/home", badge: null },
  { icon: Search, label: "Browse", to: "/home/browse", badge: 124 },
  { icon: Users, label: "Roommates", to: "/home/roommates", badge: null },
  { icon: BookOpen, label: "Messages", to: "/home/messages", badge: null },
  { icon: Heart, label: "Saved", to: "/home/saved", badge: null },
];

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
    className={`rounded-full px-3 py-1 text-[12px] font-medium border transition-all duration-200 capitalize ${
      active
        ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30"
        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
    }`}
  >
    {label}
  </button>
);

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 mb-2.5">
    {label}
  </p>
);

const SideBar = () => {
  const { menuIsOpen, setMenuIsOpen } = useUiContext();
  const isMobile = useIsMobile();
  const backdropRef = useRef<HTMLDivElement>(null);
  const { filters, setFilter, resetFilters, toggleList } = useFilters();

  const activeFilterCount = [
    filters.city !== "Bengaluru",
    filters.roomType !== "all",
    filters.propertyTypes.length > 0,
    filters.maxBudget < 80000,
    filters.amenities.length > 0,
    filters.gender !== "Any",
  ].filter(Boolean).length;

  useEffect(() => {
    if (!backdropRef.current || !isMobile) return;
    if (menuIsOpen) {
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: "auto",
      });
    } else {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        pointerEvents: "none",
      });
    }
  }, [menuIsOpen, isMobile]);

  const formatBudget = (v: number) =>
    v >= 80000 ? "₹80K+" : `₹${(v / 1000).toFixed(0)}K/mo`;

  return (
    <>
      {isMobile && (
        <div
          ref={backdropRef}
          onClick={() => setMenuIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-10 hidden opacity-0 pointer-events-none"
        />
      )}

      <div className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-5 flex flex-col gap-6">
        {isMobile && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-orange-400" />
              <span className="text-[14px] font-semibold text-white">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setMenuIsOpen(false)}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        )}

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
                    <Icon
                      size={16}
                      className={isActive ? "text-orange-400" : ""}
                    />
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

        <div className="h-px bg-white/5" />

        <div>
          <SectionLabel label="City" />
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Chip
                key={c}
                label={c}
                active={filters.city === c}
                onClick={() => setFilter("city", c)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Room Type" />
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map(({ label, value }) => (
              <Chip
                key={value}
                label={label}
                active={filters.roomType === value}
                onClick={() => setFilter("roomType", value)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Property Type" />
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.propertyTypes.includes(p)}
                onClick={() => toggleList("propertyTypes", p)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Max Budget" />
          <p className="text-[15px] font-bold text-white mb-3">
            {formatBudget(filters.maxBudget)}
          </p>
          <input
            title="budget"
            type="range"
            min={3000}
            max={80000}
            step={1000}
            value={filters.maxBudget}
            onChange={(e) => setFilter("maxBudget", +e.target.value)}
            className="w-full accent-orange-500 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-zinc-600">₹3K</span>
            <span className="text-[11px] text-zinc-600">₹80K</span>
          </div>
        </div>

        <div>
          <SectionLabel label="Amenities" />
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <Chip
                key={a}
                label={a}
                active={filters.amenities.includes(a)}
                onClick={() => toggleList("amenities", a)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Preferred For" />
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip
                key={g}
                label={g}
                active={filters.gender === g}
                onClick={() => setFilter("gender", g)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-[13px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition"
            >
              <RotateCcw size={13} /> Reset filters
            </button>
          )}
          <button
            onClick={() => isMobile && setMenuIsOpen(false)}
            className="w-full rounded-xl bg-orange-500 py-3 text-[13px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            {activeFilterCount > 0
              ? `Apply ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""}`
              : "Apply Filters"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
