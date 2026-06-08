import { Users } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
      <Users size={28} className="text-orange-400" />
    </div>
    <div>
      <p className="text-[16px] font-semibold text-white">No matches yet</p>
      <p className="text-[13px] text-zinc-500 mt-1 max-w-xs">
        Complete your preference survey to get matched with compatible roommates.
      </p>
    </div>
    <a
      href="/home/survey"
      className="rounded-xl bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
    >
      Take Survey →
    </a>
  </div>
);