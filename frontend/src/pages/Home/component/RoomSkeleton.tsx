export const RoomSkeleton = () => (
  <div className="flex gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 animate-pulse">
    <div className="h-14 w-14 rounded-xl bg-zinc-800/60 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 w-1/2 bg-zinc-700/60 rounded-full" />
      <div className="h-2.5 w-3/4 bg-zinc-700/40 rounded-full" />
      <div className="h-2 w-full bg-zinc-700/30 rounded-full mt-1" />
    </div>
  </div>
);