import { RefreshCw, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetAllNotifications } from "../../hooks/useNotification";
import { groupByDate } from "../../services/groupByDate.notification";
import { EmptyState } from "./EmptyState";
import { NotifSkeleton } from "./NotifSkeleton";
import { NotifRow } from "./NotifRow";

export type FilterTab = "all" | "unread" | "action";

const Notifications = () => {
    const { data: notifications = [], isLoading, isError, refetch, isFetching } = useGetAllNotifications();
    const [tab, setTab] = useState<FilterTab>("all");
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    // Filter
    const filtered = useMemo(() => {
        if (tab === "unread") return notifications.filter((n) => !n.sent);
        if (tab === "action") return notifications.filter((n) => n.requiresAction && !n.replied);
        return notifications;
    }, [notifications, tab]);

    const grouped = useMemo(() => groupByDate(filtered), [filtered]);
    const groupKeys = Object.keys(grouped);

    const unreadCount = notifications.filter((n) => !n.sent).length;
    const actionCount = notifications.filter((n) => n.requiresAction && !n.replied).length;

    const toggleGroup = (key: string) =>
        setExpandedGroups((p) => ({ ...p, [key]: p[key] === false ? true : false }));

    const TABS: { id: FilterTab; label: string; count?: number }[] = [
        { id: "all", label: "All", count: notifications.length },
        { id: "unread", label: "Unread", count: unreadCount },
        { id: "action", label: "Actions", count: actionCount },
    ];

    return (
        <div className="flex flex-col gap-0 pb-10">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-0 pt-2 pb-5">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">Inbox</p>
                    <h1 className="text-[22px] font-bold text-white">Notifications</h1>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-50"
                >
                    <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
                </button>
            </div>

            {/* ── Filter tabs ── */}
            <div className="flex gap-2 mb-5">
                {TABS.map(({ id, label, count }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold border transition ${tab === id
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "border-white/8 bg-white/3 text-zinc-500 hover:text-white hover:border-white/15"
                            }`}
                    >
                        {label}
                        {count !== undefined && count > 0 && (
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === id ? "bg-white/20 text-white" : "bg-white/8 text-zinc-500"
                                }`}>
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Error ── */}
            {isError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 mb-4 flex items-center justify-between gap-3">
                    <p className="text-[13px] text-red-400">Failed to load notifications.</p>
                    <button onClick={() => refetch()} className="text-[12px] font-semibold text-red-400 hover:text-red-300 transition">
                        Retry
                    </button>
                </div>
            )}

            {/* ── Loading ── */}
            {isLoading && (
                <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => <NotifSkeleton key={i} />)}
                </div>
            )}

            {/* ── Empty ── */}
            {!isLoading && !isError && filtered.length === 0 && <EmptyState tab={tab} />}

            {/* ── Grouped list ── */}
            {!isLoading && !isError && filtered.length > 0 && (
                <div className="flex flex-col gap-4">
                    {groupKeys.map((groupKey) => {
                        const items = grouped[groupKey];
                        const isCollapsed = expandedGroups[groupKey] === false;

                        return (
                            <div key={groupKey} className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden">
                                {/* Group header */}
                                <button
                                    onClick={() => toggleGroup(groupKey)}
                                    className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/3 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{groupKey}</p>
                                        <span className="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-[10px] text-zinc-600">
                                            {items.length}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-zinc-600 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                                    />
                                </button>

                                {/* Notifications */}
                                {!isCollapsed && items.map((n) => <NotifRow key={n._id} n={n} />)}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;