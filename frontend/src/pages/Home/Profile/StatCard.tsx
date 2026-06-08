export const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/5 bg-white/3 px-3 py-4 flex flex-col items-center gap-1.5 text-center">
    <span className="text-orange-400">{icon}</span>
    <p className="text-[18px] font-bold text-white">{value}</p>
    <p className="text-[10px] text-zinc-600">{label}</p>
  </div>
);