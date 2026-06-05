import { Minus,Plus } from "lucide-react";

export const Counter = ({
  label, icon, value, onChange, min = 0,
}: {
  label: string; icon: React.ReactNode; value: number;
  onChange: (v: number) => void; min?: number;
}) => (
  <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="text-orange-400">{icon}</span>
      <span className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"
      >
        <Minus size={14} />
      </button>
      <span className="text-[22px] font-bold text-white w-8 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);
