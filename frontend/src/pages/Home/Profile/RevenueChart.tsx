export const RevenueChart = ({
  months,
  values,
}: {
  months: string[];
  values: number[];
}) => {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {months.map((m, i) => (
        <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className={`w-full rounded-t-lg ${i === months.length - 1 ? "bg-orange-500" : "bg-zinc-700/60"}`}
            style={{ height: `${(values[i] / max) * 100}%` }}
          />
          <span
            className={`text-[9px] font-medium ${i === months.length - 1 ? "text-orange-400" : "text-zinc-600"}`}
          >
            {m}
          </span>
        </div>
      ))}
    </div>
  );
};
