export const EmptyState = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-white/5 bg-white/3 py-12 flex flex-col items-center gap-3 text-center">
    <span className="text-4xl">🔍</span>
    <p className="text-[14px] font-semibold text-zinc-400">No {label} found</p>
    <p className="text-[12px] text-zinc-600">Try adjusting your filters</p>
  </div>
);