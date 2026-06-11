export const RevenueChart = () => {
    const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const values = [65, 72, 58, 80, 75, 85, 90, 100];

    return (
        <div className="flex items-end gap-2 h-24 w-full">
            {months.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${i === months.length - 1 ? "bg-orange-500" : "bg-zinc-700/60"}`}
                        style={{ height: `${values[i]}%` }}
                    />
                    <span className={`text-[9px] font-medium ${i === months.length - 1 ? "text-orange-400" : "text-zinc-600"}`}>
                        {m}
                    </span>
                </div>
            ))}
        </div>
    );
};
