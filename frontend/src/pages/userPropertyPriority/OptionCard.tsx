export const OptionCard = ({
  icon, label, active, onClick, multiDot,
}: {
  icon: React.ReactNode; label: string; active: boolean;
  onClick: () => void; multiDot?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border p-5 text-center transition-all duration-200 active:scale-95 ${
      active
        ? "border-orange-500 bg-[#1a0f08]"
        : "border-white/8 bg-[#0d1117] hover:border-white/15"
    }`}
  >
    {active && multiDot && (
      <span className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    )}
    {active && !multiDot && (
      <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-orange-500" />
    )}
    <span className={active ? "text-orange-400" : "text-zinc-500"}>{icon}</span>
    <span className={`text-[12px] font-semibold ${active ? "text-orange-300" : "text-zinc-400"}`}>{label}</span>
  </button>
);