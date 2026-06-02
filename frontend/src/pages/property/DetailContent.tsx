import { useState } from "react";
import type {
  propertyOwnerType,
  PropertyType,
} from "../../types/property.types";
import { Section } from "./Section";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  Phone,
  Building2,
  Wifi,
  Car,
  Wind,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Zap,
  ArrowUpDown,
  Dumbbell,
  Waves,
  Shield,
  PawPrint,
  Home,
  TreePine,
  Droplets,
  Thermometer,
  Sofa,
} from "lucide-react";
import { useCreateNotification } from "../../hooks/useNatification";
import { useGetMe } from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";

const AMENITY_CONFIG: Record<string, { icon: React.ReactNode; label: string }> =
  {
    wifi: { icon: <Wifi size={16} />, label: "WiFi" },
    parking: { icon: <Car size={16} />, label: "Parking" },
    ac: { icon: <Wind size={16} />, label: "AC" },
    tv: { icon: <Tv size={16} />, label: "TV" },
    kitchen: { icon: <UtensilsCrossed size={16} />, label: "Kitchen" },
    washingMachine: {
      icon: <WashingMachine size={16} />,
      label: "Washing Machine",
    },
    powerBackup: { icon: <Zap size={16} />, label: "Power Backup" },
    lift: { icon: <ArrowUpDown size={16} />, label: "Lift" },
    gym: { icon: <Dumbbell size={16} />, label: "Gym" },
    swimmingPool: { icon: <Waves size={16} />, label: "Swimming Pool" },
    security: { icon: <Shield size={16} />, label: "Security" },
    petFriendly: { icon: <PawPrint size={16} />, label: "Pet Friendly" },
    balcony: { icon: <Home size={16} />, label: "Balcony" },
    garden: { icon: <TreePine size={16} />, label: "Garden" },
    waterSupply: { icon: <Droplets size={16} />, label: "Water Supply" },
    geyser: { icon: <Thermometer size={16} />, label: "Geyser" },
    furnished: { icon: <Sofa size={16} />, label: "Furnished" },
  };

export const DetailContent = ({
  property,
  emoji,
}: {
  property: PropertyType;
  emoji: string;
}) => {
  const { mutate: createNotification, isPending: creatingNotification } =
    useCreateNotification();
  const { data: me, isPending: loadingYou } = useGetMe();
  const [photoIndex, setPhotoIndex] = useState(0);
  const hasPhotos = property.photos.length > 0;

  if (!me || loadingYou) {
    return <Spinner />;
  }

  return (
    <>
      <Section id="overview" title="Overview">
        <div className="flex flex-col gap-2">
          <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden bg-zinc-800/60 flex items-center justify-center">
            {hasPhotos ? (
              <img
                src={property.photos[photoIndex]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-7xl opacity-50">{emoji}</span>
            )}

            <div className="absolute top-3 left-3 flex gap-1.5">
              {property.verified && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 px-2.5 py-1 text-[10px] font-bold text-green-400 backdrop-blur-sm">
                  <CheckCircle2 size={9} /> Verified
                </span>
              )}
              <span className="rounded-full bg-black/50 border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 capitalize backdrop-blur-sm">
                {property.propertyType}
              </span>
            </div>
          </div>

          {hasPhotos && property.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {property.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  className={`h-14 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    photoIndex === i
                      ? "border-orange-500"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            {
              icon: <Bed size={15} />,
              label: "Bedrooms",
              value: property.totalBedRooms,
            },
            {
              icon: <Bath size={15} />,
              label: "Bathrooms",
              value: property.totalBathrooms,
            },
            {
              icon: <Maximize2 size={15} />,
              label: "Built-up",
              value: `${property.builtUpArea} sqft`,
            },
            {
              icon: <Building2 size={15} />,
              label: "Rooms",
              value: property.totalRooms,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-white/5 bg-white/3 px-3 py-3 flex flex-col items-center gap-1.5 text-center"
            >
              <span className="text-orange-400">{icon}</span>
              <p className="text-[15px] font-bold text-white">{value}</p>
              <p className="text-[10px] text-zinc-600">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">
              {property.location.address}
            </p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              {property.location.city}, {property.location.state} —{" "}
              {property.location.zipCode}
            </p>
            {property.location.coordinates.lat && (
              <p className="text-[11px] text-zinc-700 mt-1">
                {property.location.coordinates.lat.toFixed(4)},{" "}
                {property.location.coordinates.lng?.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section id="amenities" title="Amenities">
        {property.amenities.length === 0 ? (
          <p className="text-[13px] text-zinc-600">No amenities listed.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {property.amenities.map((a) => {
              const cfg = AMENITY_CONFIG[a] ?? {
                icon: <CheckCircle2 size={15} />,
                label: a,
              };
              return (
                <div
                  key={a}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/3 px-3.5 py-2.5"
                >
                  <span className="text-orange-400 shrink-0">{cfg.icon}</span>
                  <span className="text-[12px] font-medium text-zinc-300">
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {property.aiTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {property.aiTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[11px] text-zinc-500 capitalize"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section id="pricing" title="Pricing Overview">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Starting from",
              value: "Check Rooms",
              sub: "per room/mo",
              accent: true,
            },
            {
              label: "Property Rating",
              value: `${property.rating} ★`,
              sub: `${property.totalReviews} reviews`,
            },
            {
              label: "Total Rooms",
              value: `${property.totalRooms}`,
              sub: "available rooms",
            },
          ].map(({ label, value, sub, accent }) => (
            <div
              key={label}
              className={`rounded-2xl border p-4 flex flex-col gap-1 ${accent ? "border-orange-500/30 bg-orange-500/5" : "border-white/5 bg-white/3"}`}
            >
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">
                {label}
              </p>
              <p
                className={`text-[22px] font-bold ${accent ? "text-orange-400" : "text-white"}`}
              >
                {value}
              </p>
              <p className="text-[11px] text-zinc-600">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-white">
              Check Available Rooms
            </p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Shared &amp; private rooms with pricing
            </p>
          </div>
          <button className="rounded-xl bg-orange-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition shrink-0 shadow-lg shadow-orange-500/20">
            View Rooms
          </button>
        </div>
      </Section>

      <Section id="rules" title="House Rules & Terms">
        {property.rules.length === 0 ? (
          <p className="text-[13px] text-zinc-600">No specific rules listed.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {property.rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-3"
              >
                <div className="h-5 w-5 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-orange-400">
                    {i + 1}
                  </span>
                </div>
                <p className="text-[13px] text-zinc-300 leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="owner" title="Owner Details">
        <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/15 flex items-center justify-center shrink-0">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-white truncate">
                  {(property.ownerId as propertyOwnerType)?.name ??
                    "Property Owner"}
                </p>
                {(property.ownerId as propertyOwnerType)?.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400 shrink-0">
                    <CheckCircle2 size={8} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {(property.ownerId as propertyOwnerType)?.phoneNumber && (
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 px-3 py-2.5">
                <Phone size={14} className="text-orange-400 shrink-0" />
                <span className="text-[13px] text-zinc-300">
                  {(property.ownerId as propertyOwnerType).phoneNumber}
                </span>
              </div>
            )}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-[13px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              onClick={() => {
                createNotification({
                  senderId: me._id,
                  receiverId: property.ownerId._id,
                  type: "VISIT_REQUEST",
                });
              }}
              disabled = {creatingNotification}
            >
              <Phone size={14} /> Request a Visit
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">
              Co-Living Property Management
            </p>
            <p className="text-[11px] text-zinc-600">
              Verified listings · Hassle-free move-in
            </p>
          </div>
        </div>
      </Section>

      <div className="h-8" />
    </>
  );
};
