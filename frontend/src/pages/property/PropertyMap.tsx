import { MapPin } from "lucide-react";

export const PropertyMap = ({
  lat,
  lng,
  name,
  className = "",
}: {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}) => {
  const zoom = 15;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 ${className}`}
    >
      <iframe
        title={`Map for ${name}`}
        src={src}
        className="w-full h-full border-0"
        loading="lazy"
      />

      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl bg-black/70 backdrop-blur-sm px-3 py-2">
        <MapPin size={13} className="text-orange-400 shrink-0" />
        <span className="text-[12px] text-zinc-300 truncate">{name}</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[11px] text-orange-400 hover:text-orange-300 whitespace-nowrap transition"
        >
          Open map ↗
        </a>
      </div>
    </div>
  );
};
