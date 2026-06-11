export const BookingRow = ({
    name, email, property, room, moveIn, status, initials, color,
}: {
    name: string; email: string; property: string; room: string;
    moveIn: string; status: "pending" | "approved" | "rejected";
    initials: string; color: string;
}) => {
    const statusCfg = {
        pending: { label: "Pending", cls: "bg-yellow-500/15 border-yellow-500/20 text-yellow-400" },
        approved: { label: "Approved", cls: "bg-green-500/15 border-green-500/20 text-green-400" },
        rejected: { label: "Rejected", cls: "bg-red-500/15 border-red-500/20 text-red-400" },
    }[status];

    return (
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/2 transition">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shrink-0 ${color}`}>
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{name}</p>
                <p className="text-[11px] text-zinc-600 truncate">{email}</p>
            </div>
            <div className="hidden sm:block text-right min-w-0">
                <p className="text-[12px] font-medium text-zinc-300 truncate">{property}</p>
                <p className="text-[11px] text-zinc-600">{room}</p>
            </div>
            <div className="hidden md:block text-right shrink-0">
                <p className="text-[12px] text-zinc-400">{moveIn}</p>
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${statusCfg.cls}`}>
                {statusCfg.label}
            </span>
        </div>
    );
};