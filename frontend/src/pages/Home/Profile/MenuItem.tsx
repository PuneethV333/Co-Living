import { ChevronRight } from "lucide-react";

export const MenuItem = ({
  icon, label, sub, onClick, danger = false, badge,
}: {
  icon: React.ReactNode; label: string; sub?: string;
  onClick?: () => void; danger?: boolean; badge?: string | number;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3.5 hover:bg-white/5 hover:border-white/10 transition active:scale-[0.99] text-left"
  >
    <span className={danger ? "text-red-400" : "text-orange-400"}>{icon}</span>
    <div className="flex-1 min-w-0">
      <p className={`text-[13px] font-semibold ${danger ? "text-red-400" : "text-white"}`}>{label}</p>
      {sub && <p className="text-[11px] text-zinc-600 mt-0.5">{sub}</p>}
    </div>
    {badge !== undefined && (
      <span className="rounded-full bg-orange-500/20 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
        {badge}
      </span>
    )}
    {!danger && <ChevronRight size={15} className="text-zinc-600 shrink-0" />}
  </button>
);