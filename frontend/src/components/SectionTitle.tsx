export const SectionTitle = ({ step, label }: { step: number; label: string }) => (
  <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-2.5 flex items-center gap-2">
    <span className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">{step}</span>
    <span className="text-[12px] font-bold text-orange-300 uppercase tracking-wider">{label}</span>
  </div>
);
