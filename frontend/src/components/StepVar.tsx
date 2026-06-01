export const StepBar = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-1.5 w-full">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-0.75 flex-1 rounded-full transition-all duration-500 ${
          i < current ? "bg-orange-500" : "bg-zinc-700"
        }`}
      />
    ))}
  </div>
);