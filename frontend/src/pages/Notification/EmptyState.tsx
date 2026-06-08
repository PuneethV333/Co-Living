import { Bell } from "lucide-react";
import type { FilterTab } from "./Notification";

export const EmptyState = ({ tab }: { tab: FilterTab }) => (
    <div className="flex flex-col items-center gap-4 py-16 text-center px-6">
        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
            <Bell size={22} className="text-zinc-600" />
        </div>
        <div>
            <p className="text-[15px] font-semibold text-white">
                {tab === "action" ? "No pending actions" : tab === "unread" ? "All caught up!" : "No notifications yet"}
            </p>
            <p className="text-[13px] text-zinc-600 mt-1">
                {tab === "action" ? "You have no requests that need a response." : "New notifications will appear here."}
            </p>
        </div>
    </div>
);
