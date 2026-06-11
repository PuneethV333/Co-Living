export const StatCard2 = ({
    icon, label, value, sub, subColor = "text-green-400", gradient,
}: {
    icon: React.ReactNode; label: string; value: string;
    sub?: string; subColor?: string; gradient?: string;
}) => (
    <div className={`relative rounded-2xl border border-white/5 bg-[#111827] p-5 flex flex-col gap-3 overflow-hidden ${gradient ?? ""}`}>
        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-[26px] font-bold text-white leading-none">{value}</p>
            <p className="text-[12px] text-zinc-500 mt-1">{label}</p>
            {sub && <p className={`text-[11px] font-semibold mt-1.5 ${subColor}`}>{sub}</p>}
        </div>
        {/* decorative circle */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/3" />
    </div>
);