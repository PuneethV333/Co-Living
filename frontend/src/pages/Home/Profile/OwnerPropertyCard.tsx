import {
    Building2, Users,
    Eye, Pencil, Trash2,
    MapPin, Star, MoreHorizontal, Power,
    CheckCircle2, AlertCircle, 
} from "lucide-react";
import { getPropertyEmoji, type PropertyType } from "../../../types/property.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const OwnerPropertyCard = ({ p }: { p: PropertyType }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const emoji = getPropertyEmoji(p.propertyType);

    return (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden flex flex-col">
            {/* Image / emoji */}
            <div
                className="relative h-36 bg-zinc-800/60 flex items-center justify-center cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/home/property/details/${p._id}`)}
            >
                {p.photos[0]
                    ? <img src={p.photos[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <span className="text-6xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">{emoji}</span>
                }

                {/* Status badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {p.verified
                        ? <span className="flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                            <CheckCircle2 size={9} /> Verified
                        </span>
                        : <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 px-2.5 py-0.5 text-[10px] font-bold text-yellow-400">
                            <AlertCircle size={9} /> Pending
                        </span>
                    }
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${p.isActive
                            ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                            : "bg-zinc-700/40 border-white/8 text-zinc-500"
                        }`}>
                        {p.isActive ? "● Active" : "● Inactive"}
                    </span>
                    <span className="rounded-full bg-zinc-800/80 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-300 capitalize backdrop-blur-sm">
                        {p.propertyType}
                    </span>
                </div>

                {/* 3-dot menu */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
                        className="h-7 w-7 rounded-full bg-black/50 flex items-center justify-center text-zinc-400 hover:text-white transition"
                    >
                        <MoreHorizontal size={14} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-xl border border-white/10 bg-[#0d1117] shadow-xl overflow-hidden">
                            {[
                                { label: "View", icon: <Eye size={13} />, action: () => navigate(`/home/property/details/${p._id}`) },
                                { label: "Edit", icon: <Pencil size={13} />, action: () => { } },
                                { label: p.isActive ? "Deactivate" : "Activate", icon: <Power size={13} />, action: () => { } },
                                { label: "Delete", icon: <Trash2 size={13} />, danger: true, action: () => { } },
                            ].map(({ label, icon, action, danger }) => (
                                <button
                                    key={label}
                                    onClick={e => { e.stopPropagation(); action(); setMenuOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium hover:bg-white/5 transition ${danger ? "text-red-400" : "text-zinc-300"}`}
                                >
                                    {icon} {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <p
                        className="text-[14px] font-bold text-white leading-snug cursor-pointer hover:text-orange-300 transition"
                        onClick={() => navigate(`/home/property/details/${p._id}`)}
                    >
                        {p.name}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                        <MapPin size={10} /> {p.location.address}, {p.location.city}
                    </p>
                </div>

                {/* AI tags */}
                {p.aiTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {p.aiTags.slice(0, 3).map(tag => (
                            <span key={tag} className="rounded-full bg-white/5 border border-white/8 px-2.5 py-0.5 text-[10px] text-zinc-500">
                                {tag}
                            </span>
                        ))}
                        {!p.verified && (
                            <span className="rounded-full bg-zinc-800/60 border border-white/5 px-2.5 py-0.5 text-[10px] text-zinc-600 italic">
                                Generating…
                            </span>
                        )}
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Building2 size={11} className="text-zinc-600" /> {p.totalRooms} rooms
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={11} className="text-zinc-600" /> {p.totalBedRooms} tenants
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="text-zinc-600 text-[10px]">⬛</span> {p.builtUpArea} sqft
                    </span>
                </div>

                {/* Price + rating */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[18px] font-bold text-white">₹{p.cost.toLocaleString("en-IN")}</span>
                        <span className="text-[11px] text-zinc-600">/mo</span>
                    </div>
                    {p.rating > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-yellow-400 font-semibold">
                            <Star size={11} fill="currentColor" /> {p.rating}
                            <span className="text-zinc-600 font-normal">({p.totalReviews})</span>
                        </span>
                    )}
                    {p.rating === 0 && (
                        <span className="text-[11px] text-zinc-600 italic">Awaiting review</span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                        { icon: <Eye size={14} />, label: "View", color: "text-zinc-300", action: () => navigate(`/home/property/details/${p._id}`) },
                        { icon: <Pencil size={14} />, label: "Edit", color: "text-zinc-300", action: () => { } },
                        {
                            icon: <Power size={14} />,
                            label: p.isActive ? "Deactivate" : "Activate",
                            color: p.isActive ? "text-orange-400" : "text-green-400",
                            action: () => { },
                        },
                        { icon: <Trash2 size={14} />, label: "Delete", color: "text-red-400", action: () => { } },
                    ].map(({ icon, label, color, action }) => (
                        <button
                            key={label}
                            onClick={action}
                            className={`flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/3 py-2.5 hover:bg-white/8 transition active:scale-95 ${color}`}
                        >
                            {icon}
                            <span className="text-[9px] font-semibold">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};