/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Building2,
    ChevronDown,
    Home as HomeIcon,
    LayoutGrid,
    List,
    MapPin,
    TrendingUp,
    Users,
    SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { useGetProperties, useGetRooms } from "../../../hooks/useProperty";
import { useFilters } from "../../../hooks/useFilters";
import { PropertyCard } from "../../../components/PropertyCard";
import { RoomRow } from "../../../components/RoomRow";
import {
    useFilteredProperties,
    useFilteredRooms,
} from "../../../hooks/useFilteredData";
import { CardSkeleton } from "../component/CardSkeleton";
import { EmptyState } from "../component/EmptyState";
import { RoomSkeleton } from "../component/RoomSkeleton";
import { useGetSavedProperty } from "../../../hooks/useUser";

const SORT_LABELS: Record<string, string> = {
    recommended: "Recommended",
    price_low: "Price Low → High",
    price_high: "Price High → Low",
    newest: "Newest",
    top_rated: "Top Rated",
};

const Dashboard = () => {
    const [view, setView] = useState<"grid" | "list">("grid");

    const { filters, setFilter } = useFilters();


    const { data: saved } = useGetSavedProperty()
    const {
        data: properties,
        isLoading: propertiesLoading,
        isError: propertiesError,
    } = useGetProperties();

    const {
        data: rooms,
        isLoading: roomsLoading,
        isError: roomsError,
    } = useGetRooms();

    const filteredProperties = useFilteredProperties(properties, filters);
    const filteredRooms = useFilteredRooms(rooms, filters);

    const avgRent = rooms?.length
        ? Math.round(
            rooms.reduce((s, r) => s + r.pricing.monthlyRent, 0) /
            rooms.length /
            1000,
        )
        : 0;

    return (
        <div className="flex flex-col gap-10 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                    {
                        icon: <Building2 size={16} />,
                        label: "Properties",
                        value: String(filteredProperties.length || properties?.length || 0),
                        color: "text-orange-400",
                    },
                    {
                        icon: <HomeIcon size={16} />,
                        label: "Rooms",
                        value: String(filteredRooms.length || rooms?.length || 0),
                        color: "text-purple-400",
                    },
                    {
                        icon: <TrendingUp size={16} />,
                        label: "Avg Rent",
                        value: avgRent ? `₹${avgRent}K` : "—",
                        color: "text-green-400",
                    },
                    {
                        icon: <Users size={16} />,
                        label: "Roommates",
                        value: "340+",
                        color: "text-cyan-400",
                    },
                ].map(({ icon, label, value, color }) => (
                    <div
                        key={label}
                        className="rounded-2xl border border-white/5 bg-white/3 px-4 py-3 flex items-center gap-3"
                    >
                        <div className={`${color} opacity-80`}>{icon}</div>
                        <div>
                            <p className="text-[16px] font-bold text-white">{value}</p>
                            <p className="text-[11px] text-zinc-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button className="flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-orange-300">
                    <MapPin size={12} /> {filters.city}
                </button>

                {filters.roomType !== "all" && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-300 capitalize">
                        {filters.roomType}
                    </span>
                )}

                {filters.propertyTypes.map((pt) => (
                    <span
                        key={pt}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-300 capitalize"
                    >
                        {pt}
                    </span>
                ))}

                {filters.maxBudget < 80000 && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-300">
                        ≤ ₹{(filters.maxBudget / 1000).toFixed(0)}K
                    </span>
                )}

                {filters.amenities.map((a) => (
                    <span
                        key={a}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-300 capitalize"
                    >
                        {a}
                    </span>
                ))}

                <button
                    onClick={() => { }}
                    className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-400 hover:text-white transition md:hidden"
                >
                    <SlidersHorizontal size={12} /> Filters
                </button>
            </div>

            <section>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-white">
                            Available Properties
                        </h2>
                        <p className="text-[12px] text-zinc-500 mt-0.5">
                            Full apartments &amp; shared houses
                        </p>
                    </div>
                    <button className="text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition">
                        View all →
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <select
                            title="sort properties"
                            value={filters.sort}
                            onChange={(e) => setFilter("sort", e.target.value as any)}
                            className="w-full appearance-none rounded-xl bg-white/5 border border-white/8 pl-4 pr-9 py-2.5 text-[13px] text-zinc-300 outline-none focus:border-orange-500/50 transition cursor-pointer scheme-dark"
                        >
                            {Object.entries(SORT_LABELS).map(([val, label]) => (
                                <option key={val} value={val}>
                                    Sort: {label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                        />
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

                    <p className="text-[12px] text-zinc-600 hidden sm:block">
                        {filteredProperties.length} properties
                    </p>
                </div>

                {propertiesError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[13px] text-red-400 mb-4">
                        Failed to load properties. Please try again.
                    </div>
                )}

                <div
                    className={
                        view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                            : "flex flex-col gap-3"
                    }
                >
                    {propertiesLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                    ) : filteredProperties.length === 0 ? (
                        <EmptyState label="properties" />
                    ) : (
                        filteredProperties.map((p) => (
                            <PropertyCard key={p._id} p={p} view={view} fav={saved?.some((x) => x._id == p._id)} />
                        ))
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-white">
                            Available Rooms
                        </h2>
                        <p className="text-[12px] text-zinc-500 mt-0.5">
                            Shared &amp; private rooms ready to move in
                        </p>
                    </div>
                    <button className="text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition">
                        View all →
                    </button>
                </div>

                <div className="relative max-w-xs mb-4">
                    <select
                        title="sort rooms"
                        value={filters.roomSort}
                        onChange={(e) => setFilter("roomSort", e.target.value as any)}
                        className="w-full appearance-none rounded-xl bg-white/5 border border-white/8 pl-4 pr-9 py-2.5 text-[13px] text-zinc-300 outline-none focus:border-orange-500/50 transition cursor-pointer scheme-dark"
                    >
                        {Object.entries(SORT_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                                Sort: {label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                </div>

                <p className="text-[12px] text-zinc-600 mb-3">
                    {filteredRooms.length} rooms
                </p>

                {roomsError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[13px] text-red-400 mb-4">
                        Failed to load rooms. Please try again.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {roomsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <RoomSkeleton key={i} />)
                    ) : filteredRooms.length === 0 ? (
                        <EmptyState label="rooms" />
                    ) : (
                        filteredRooms.map((r) => {
                            const prop = properties?.find(
                                (p) => p._id === r.propertyId,
                            );
                            return <RoomRow key={r._id} r={r} propertyName={prop?.name} ownerId={prop?.ownerId._id} />;
                        })
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
