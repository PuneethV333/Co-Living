/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Search, X, LayoutGrid, List, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSearchProperties } from "../../hooks/useProperty";
import { CardSkeleton } from "../Home/component/CardSkeleton";
import { PropertyCard } from "../../components/PropertyCard";

// ── Browse page ───────────────────────────────────────────────────────────────
const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searched, setSearched] = useState(false);

  const {
    mutate: search,
    data,
    isPending,
    isError,
    reset,
  } = useSearchProperties();

  const properties = data?.data ?? [];

  useEffect(() => {
    if (initialQ.trim()) {
      setSearched(true);
      search(initialQ.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
    // keep URL in sync so it's shareable / back-button friendly
    setSearchParams({ q: query.trim() }, { replace: true });
    search(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    setSearched(false);
    setSearchParams({}, { replace: true });
    reset();
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
          Browse Properties
        </p>
        <h1 className="text-[22px] font-bold text-white">
          Find your perfect co-living space
        </h1>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Type here — city, locality, landmark..."
            className="w-full rounded-xl bg-white/5 border border-white/8 pl-10 pr-10 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={isPending || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-[13px] font-semibold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Search size={15} />
          )}
          Search
        </button>
      </div>

      {searched && !isPending && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-zinc-400">
            {isError ? (
              <span className="text-red-400">Search failed. Try again.</span>
            ) : (
              <>
                <span className="font-semibold text-white">
                  {properties.length}
                </span>{" "}
                propert{properties.length === 1 ? "y" : "ies"} found
                {query && <span className="text-zinc-600"> for "{query}"</span>}
              </>
            )}
          </p>

          {properties.length > 0 && (
            <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/5 p-1">
              <button
                onClick={() => setView("grid")}
                className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
                  view === "grid"
                    ? "bg-orange-500 text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
                  view === "list"
                    ? "bg-orange-500 text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <List size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !isPending && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-[15px] font-semibold text-white">
            Something went wrong
          </p>
          <p className="text-[13px] text-zinc-500">
            Failed to search properties. Please try again.
          </p>
          <button
            onClick={handleSearch}
            className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!isPending && !isError && properties.length > 0 && (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {properties.map((p) => (
            <PropertyCard key={p._id} p={p} view={view} />
          ))}
        </div>
      )}

      {!isPending && !isError && searched && properties.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-[15px] font-semibold text-white">
            No properties found
          </p>
          <p className="text-[13px] text-zinc-500">
            Try a different city, locality, or keyword
          </p>
          <button
            onClick={handleClear}
            className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-zinc-300 hover:text-white transition"
          >
            Clear search
          </button>
        </div>
      )}

      {!searched && !isPending && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Search size={28} className="text-orange-400" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">
              Search for properties
            </p>
            <p className="text-[13px] text-zinc-500 mt-1">
              Enter a city, locality, or property name to get started
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {[
              "Bengaluru",
              "HSR Layout",
              "Koramangala",
              "Indiranagar",
              "Whitefield",
            ].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  setSearched(true);
                  search(s);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] text-zinc-400 hover:text-white hover:border-white/20 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
