export const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden animate-pulse">
    <div className="h-36 bg-zinc-800/60" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-3 w-3/4 bg-zinc-700/60 rounded-full" />
      <div className="h-2.5 w-1/2 bg-zinc-700/40 rounded-full" />
      <div className="h-2.5 w-full bg-zinc-700/30 rounded-full mt-1" />
    </div>
  </div>
);