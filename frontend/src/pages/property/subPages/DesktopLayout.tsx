import { ArrowLeft, CheckCircle2, Map, MapPin, Star, X } from "lucide-react";
import { PropertyMap } from "../PropertyMap";
import { useNavigate } from "react-router-dom";
import type { DesktopLayoutProps } from "../../../types/property.types";
import { DetailContent } from "../DetailContent";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "pricing", label: "Pricing" },
  { id: "rules", label: "Rules" },
  { id: "owner", label: "Owner" },
];

export const DesktopLayout = ({
 mapOpen,
 setMapOpen,
  hasCoords,
  coords,
  property,
  activeTab,
  contentRef,
  emoji,
  scrollToSection
}: DesktopLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex h-[calc(100dvh-4rem)] gap-0 overflow-hidden">
      {mapOpen && hasCoords && (
        <div
          style={{ width: "42%" }}
          className="relative shrink-0 h-full flex flex-col border-r border-white/5"
        >
          <PropertyMap
            lat={coords.lat!}
            lng={coords.lng!}
            name={property.name}
            className="flex-1 rounded-none border-0"
          />

          <button
            onClick={() => setMapOpen(false)}
            className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {(!mapOpen || !hasCoords) && (
        <button
          onClick={() => setMapOpen(true)}
          disabled={!hasCoords}
          className="absolute left-4 bottom-6 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-sm px-3.5 py-2 text-[12px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Map size={14} /> Show map
        </button>
      )}

      <div ref={contentRef} className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 px-6 pt-5 pb-0 border-b border-white/5 bg-[#0A0F1C]">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition shrink-0"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold text-white truncate">
                {property.name}
              </h1>
              <p className="text-[12px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                {property.location.address}, {property.location.city}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 shrink-0">
              {property.verified && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/20 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
              <span className="flex items-center gap-1 text-[12px] text-yellow-400 font-semibold">
                <Star size={12} fill="currentColor" /> {property.rating}
                <span className="text-zinc-600 font-normal">
                  ({property.totalReviews})
                </span>
              </span>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => scrollToSection(t.id)}
                className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? "border-orange-500 text-orange-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 flex flex-col gap-8">
          <DetailContent property={property} emoji={emoji} />
        </div>
      </div>
    </div>
  );
};
