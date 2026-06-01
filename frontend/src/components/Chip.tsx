export const Chip = ({label,active,onClick}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-[12px] font-medium border transition-all duration-200 ${
      active
        ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30"
        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
    }`}
  >
    {label}
  </button>
);