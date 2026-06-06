export const StepDots = ({ current, total, label }: { current: number; total: number; label: string }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">{label}</p>
      <p className="text-[11px] font-semibold text-zinc-500">{current} / {total}</p>
    </div>
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-400 ${
          i < current ? "bg-orange-500 flex-2" : "bg-zinc-700/60 flex-1"
        }`} />
      ))}
    </div>
  </div>
);