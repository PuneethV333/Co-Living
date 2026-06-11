export const FilterChip = ({
    label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold border transition whitespace-nowrap ${active
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
    >
        {label}
    </button>
);