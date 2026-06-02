import { ChevronDown, ChevronUp, Map } from "lucide-react";
import type { MobileLayoutProps } from "../../../types/property.types";
import { DetailContent } from "../DetailContent";
import { PropertyMap } from "../PropertyMap";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "pricing", label: "Pricing" },
  { id: "rules", label: "Rules" },
  { id: "owner", label: "Owner" },
];

export const MobileLayout = ({
  mapRef,
  mapCollapsed,
  hasCoords,
  coords,
  property,
  setMapCollapsed,
  activeTab,
  contentRef,
  emoji,
  scrollToSection,
}: MobileLayoutProps) =>  (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden md:hidden">
      
      <div
        ref={mapRef}
        style={{ height: mapCollapsed ? "0px" : "220px" }}
        className="transition-all duration-500 ease-in-out shrink-0 overflow-hidden"
      >
        {hasCoords ? (
          <PropertyMap
            lat={coords.lat!}
            lng={coords.lng!}
            name={property.name}
            className="h-full rounded-none border-x-0 border-t-0"
          />
        ) : (
          <div className="h-full bg-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <Map size={28} className="text-zinc-600 mx-auto mb-2" />
              <p className="text-[12px] text-zinc-600">No location data</p>
            </div>
          </div>
        )}
      </div>

      
      <button
        onClick={() => setMapCollapsed((p) => !p)}
        className="flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900/80 border-b border-white/5 text-zinc-500 hover:text-white transition text-[11px] shrink-0"
      >
        {mapCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        {mapCollapsed ? "Show map" : "Hide map"}
      </button>

      
      <div className="flex gap-1 px-4 py-2 border-b border-white/5 bg-[#0A0F1C] overflow-x-auto scrollbar-hide shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => scrollToSection(t.id)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
              activeTab === t.id
                ? "bg-orange-500 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto scrollbar-hide px-4 py-5 flex flex-col gap-8"
      >
        <DetailContent property={property} emoji={emoji} />
      </div>
    </div>
  );