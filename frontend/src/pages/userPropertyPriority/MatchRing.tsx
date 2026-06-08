export const MatchRing = ({ score }: { score: number }) => {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? "text-green-400" :
    pct >= 60 ? "text-orange-400" :
    "text-zinc-500";
  const ringColor =
    pct >= 80 ? "stroke-green-500" :
    pct >= 60 ? "stroke-orange-500" :
    "stroke-zinc-600";
  const circumference = 2 * Math.PI * 18;
  const dash = (pct / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
        <circle
          cx="22" cy="22" r="18" fill="none" strokeWidth="3"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          className={ringColor}
        />
      </svg>
      <span className={`text-[11px] font-bold z-10 ${color}`}>{pct}%</span>
    </div>
  );
};