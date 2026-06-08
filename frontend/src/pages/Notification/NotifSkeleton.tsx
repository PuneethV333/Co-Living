export const NotifSkeleton = () => (
  <div className="flex gap-3 p-4 animate-pulse">
    <div className="h-11 w-11 rounded-2xl bg-zinc-800/60 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 w-1/3 bg-zinc-700/60 rounded-full" />
      <div className="h-2.5 w-3/4 bg-zinc-700/40 rounded-full" />
      <div className="h-2 w-1/4 bg-zinc-700/20 rounded-full" />
    </div>
  </div>
);
