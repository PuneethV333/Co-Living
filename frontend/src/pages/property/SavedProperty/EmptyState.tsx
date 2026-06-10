import { Heart } from "lucide-react";

export const EmptyState = ({ filtered }: { filtered: boolean }) => (
    <div className="flex flex-col items-center gap-4 py-16 text-center px-4">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Heart size={26} className="text-red-400" />
        </div>
        <div>
            <p className="text-[16px] font-semibold text-white">
                {filtered ? "No results found" : "No saved properties"}
            </p>
            <p className="text-[13px] text-zinc-500 mt-1 max-w-xs">
                {filtered
                    ? "Try a different search term."
                    : "Tap the heart on any property to save it here."}
            </p>
        </div>
    </div>
);