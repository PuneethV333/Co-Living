import { useState } from "react";
import { Heart, LayoutGrid, List, Search } from "lucide-react";
import { useGetSavedProperty } from "../../../hooks/useUser";
import { PropertyCard } from "../../../components/PropertyCard";
import { CardSkeleton } from "../../Home/component/CardSkeleton";
import { EmptyState } from "./EmptyState";


const SavedProperties = () => {
    const { data: saved = [], isLoading, isError, refetch } = useGetSavedProperty();

    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const filtered = saved.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.city.toLowerCase().includes(search.toLowerCase()) ||
        p.location.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 pb-10">


            <div className="pt-2 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
                        Your Collection
                    </p>
                    <h1 className="text-[22px] font-bold text-white">Saved Properties</h1>
                    {!isLoading && !isError && (
                        <p className="text-[13px] text-zinc-500 mt-0.5">
                            {saved.length} saved propert{saved.length === 1 ? "y" : "ies"}
                        </p>
                    )}
                </div>

                {saved.length > 0 && (
                    <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 shrink-0">
                        <Heart size={12} fill="#f87171" className="text-red-400" />
                        <span className="text-[12px] font-semibold text-red-400">{saved.length}</span>
                    </div>
                )}
            </div>


            {!isLoading && saved.length > 0 && (
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search saved properties…"
                            className="w-full rounded-xl border border-white/8 bg-white/5 pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition"
                        />
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/5 p-1 shrink-0">
                        <button
                            onClick={() => setView("grid")}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${view === "grid" ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${view === "list" ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
            )}

            {isError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-3">
                    <p className="text-[13px] text-red-400">Failed to load saved properties.</p>
                    <button
                        onClick={() => refetch()}
                        className="text-[12px] font-semibold text-red-400 hover:text-red-300 transition"
                    >
                        Retry
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
            )}

            {!isLoading && !isError && saved.length === 0 && <EmptyState filtered={false} />}
            {!isLoading && !isError && saved.length > 0 && filtered.length === 0 && (
                <EmptyState filtered />
            )}

            {!isLoading && !isError && filtered.length > 0 && (
                <>
                    {search && (
                        <p className="text-[12px] text-zinc-600 -mt-2">
                            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
                        </p>
                    )}
                    <div className={
                        view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                            : "flex flex-col gap-3"
                    }>
                        {filtered.map((p) => (
                            <PropertyCard
                                key={p._id}
                                p={p}
                                view={view}
                                fav={true}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SavedProperties;