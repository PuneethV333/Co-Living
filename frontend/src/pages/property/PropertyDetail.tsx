import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { useGetPropertyDetails } from "../../hooks/useProperty";
import { MobileLayout } from "./subPages/MobileLayout";
import { DesktopLayout } from "./subPages/DesktopLayout";
import { AlertCircle } from "lucide-react";

const PROPERTY_EMOJI: Record<string, string> = {
  apartment: "🏢",
  house: "🏠",
  villa: "🏡",
  studio: "🏙️",
  pg: "🏘️",
  hostel: "🏨",
  farmhouse: "🌾",
  office: "🏢",
  shop: "🏪",
  warehouse: "🏭",
  land: "🌿",
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: property,
    isLoading,
    isError,
  } = useGetPropertyDetails(id ?? "");

  const [activeTab, setActiveTab] = useState("overview");
  const [mapOpen, setMapOpen] = useState(true);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const hasCoords =
    property?.location.coordinates.lat !== null &&
    property?.location.coordinates.lng !== null;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => setMapCollapsed(el.scrollTop > 60);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    const container = contentRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - 60;
    container.scrollTo({ top, behavior: "smooth" });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );

  if (isError || !property)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-[16px] font-semibold text-white">
          Property not found
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition"
        >
          Go back
        </button>
      </div>
    );

  const coords = property.location.coordinates;
  const emoji = PROPERTY_EMOJI[property.propertyType] ?? "🏠";

  return (
    <div className="relative">
      <MobileLayout
        mapRef={mapRef}
        mapCollapsed={mapCollapsed}
        hasCoords={hasCoords}
        coords={coords}
        property={property}
        setMapCollapsed={setMapCollapsed}
        activeTab={activeTab}
        contentRef={contentRef}
        emoji={emoji}
        scrollToSection={scrollTo}
      />
      <DesktopLayout
        mapOpen={mapOpen}
        setMapOpen={setMapOpen}
        hasCoords={hasCoords}
        coords={coords}
        property={property}
        activeTab={activeTab}
        contentRef={contentRef}
        emoji={emoji}
        scrollToSection={scrollTo}
      />
    </div>
  );
};

export default PropertyDetail;
