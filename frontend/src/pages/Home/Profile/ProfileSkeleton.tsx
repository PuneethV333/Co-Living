export const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6 pb-10 animate-pulse">
    <div className="flex flex-col items-center gap-3 pt-6">
      <div className="h-24 w-24 rounded-3xl bg-zinc-800/60" />
      <div className="h-4 w-32 bg-zinc-700/60 rounded-full" />
      <div className="h-3 w-24 bg-zinc-700/40 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl bg-zinc-800/40" />)}
    </div>
    {[1,2,3,4].map((i) => <div key={i} className="h-14 rounded-2xl bg-zinc-800/30" />)}
  </div>
);